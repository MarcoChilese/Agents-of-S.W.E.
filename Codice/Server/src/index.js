var compression = require('compression');
var http = require('http');
var fs = require('fs');
var cors = require('cors');
var url = require('url');
var express = require('express');
var argv = require('minimist')(process.argv.slice(2));

// var jsbayesviz = require('jsbayes-viz');

const bodyParser = require('body-parser');
const Network = require('./Network');
const database = require('./influxdb');

const config = require('./conf.json');


class Server {

	constructor() {
		// Init Express
		this.app = express();
		this.app.use(express.json());
		this.app.use(bodyParser.json({limit: '50mb'}));
		this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
		this.app.use(compression());
		this.app.use(cors({origin: '*'}));

		// Get the absolute path where the script run
		this.path = `${__dirname}/..`;
		this.conf = config;

		// Array of InfluxDB object
		this.db = [];

		// pool of networks
		this.pool = [];

		// list of network jsbayse.graph
		this.networks = [];


		this.server = null; 

		// Simple parser
		if (Server.configParser(config) === true)
			this.config = config;
		else
			throw new Error("[code_error] - Configurazioni mancanti nel file .conf");

		// Check param
		if (Server.checkParam(argv)) {
			this.port = argv['p'];
			this.host = ((argv['h'] === undefined) ? 'localhost' : argv['h']);
		}
		else{
			this.port = 8600;
			this.host = ((argv['h'] === undefined) ? 'localhost' : argv['h']);
			// throw new Error("[code_error] - Parametri passati mancanti");
		}
	}


	/**
	 * Method to configure express
	 * @throws {Error}
	 */
	configExpressApp() {

		// Return the current time
		this.app.get('/', (req, res) => {
			res.json({time: new Date()});
		});

		// Return a json with the current date and the port where the server is listening
		this.app.get('/alive', (req, res) => {
			var status = {
				date: new Date().toString(),
				port: this.port
			}

			res.json(status);
		});

		// Path per richiedere tutte le reti salvate in filesystem
		this.app.get('/networks', (req, res) => {
			const ris = this.getNetworks();
			res.json(ris);
		});

		// Method for uploading a network
		this.app.post('/uploadnetwork', (req, res) => {
			try {
				this.saveNetworkToFile(req.body);
			}catch (err) {
				res.status(404).send("ERRORE CARICAMENTO RETE ");
			}
			res.send("Rete caricata");
		});

		this.app.get('/getjsbayesviz/:net', (req, res) => {
			let name = this.parserNetworkNameURL(req.params.net);
			return res.json(this.networks[name].graph);
		});

		this.app.get('/getpool', (req, res) => {
			res.json(Object.keys(this.pool));
		});

		// Method for getting a definitoin of a network in json
		this.app.get('/getnetwork/:net', (req, res) => {
			let name = req.params.net;
			if(name === '' || name === undefined)
				name = false;
			else
				name = name.replace(/ /g, '');

			if(name === false)
				res.status(404).send("Network not found");

			else{
				let dirs = fs.readdirSync(`${this.path}/${this.conf['saved_network']}`);

				if(dirs.includes(`${name}.json`)){
					fs.readFile(`${this.path}/${this.conf['saved_network']}/${name}.json`, (err, data) => {
						if(err)
							throw err;
						res.json(JSON.parse(data));
					});
				}
				else
					res.status(404);
			}
		});

		// Route per ritornare le reti instanziate nell'array
		this.app.get('/networkslive', (req, res) => {
			let tmp = {};

			for(let rete in this.networks)
				tmp[this.networks[rete].net.name] = this.networks[rete].monitoring;

				res.json(tmp);
			});

		this.app.get('/deletenetwork/:net', (req, res) => {
			let name = req.params.net;
			// var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
			if(name === '' || name === undefined )
				res.status(404).send("Network name empty !");
			else{
				name = name.replace(/ /g, '_');
				fs.readdir(`${this.path}/${this.conf['saved_network']}`, (err, files) => {
				if(err)
					throw err;

				if(files.includes(`${name}.json`)){
					fs.unlink(`${this.path}/${this.conf['saved_network']}/${name}.json`, (err) => {
						if(err)
							throw err;
					});
					res.status(200).send("Network deleted!");
				}
				else
					res.status(404).send("Network not found !");
				});
			}
		});

		// Add to monitoring pool
		this.app.get('/addtopool/:net', (req, res) => {
			let name = this.parserNetworkNameURL(req.params.net);
			
			if(name === false)
				res.status(404).send("Network not valid !");

			if(this.networks[name].monitoring == false){
				if(this.addToPool(name)){
					this.networks[name].monitoring = true;
					res.send("Network on monitoring !");
				}
				else
					res.status(404).send("Error network add to pool !");
			}
		});

		// Return the probability of the given network
		this.app.get('/getnetworkprob/:net', (req, res) => {
			let name = this.parserNetworkNameURL(req.params.net);

			if(name === false){
				res.status(404).send("Network not found");
				return;
			}

			if(this.networks[name].monitoring == false){
				res.status(404).send("Network not monitoring");
				return;
			}

			res.json(this.networks[name].getProbabilities());
		});

		this.app.get('/deletenetpool/:net', (req, res) => {
			let name = this.parserNetworkNameURL(req.params.net);

			if(name === false)
				res.status(404).send('Network not found');
		
			if(this.deleteFromPool(name))
				res.send('Network delete');
			else
				res.status(404).send('Network not found');
		});
	}

	/**
	 * Metodo per parsare il nome della rete proveniente nell'URL
	 * @return{boolean} return false se il nome è errato o la rete non e inizializzata
	 * @return{String} return il nome parsato
	 **/
	parserNetworkNameURL(name){
		if(name === '' || name === undefined || typeof name != 'string')
			return false;
		// replace spazio con _
		return name = name.replace(/ /g, "_");
	}


	/**
	 * La funzione salva la rete in un file, con nome preso dal campo data.name
	 * all'interno della definizione della rete. Controlla se esiste la folder altrimenti la crea seguendo le 'confi.json'
	 * @param {JSON} data: la rete rappresentate in json
	 * @throws {Error}
	 * @returns {boolean}
	 */
	saveNetworkToFile(data) {
		let dirs = fs.readdirSync(`${this.path}`);

		// Controllo se esiste la cartella di salvataggio 
		if(!dirs.includes(this.conf['saved_network'])){
			try{
				fs.mkdirSync(`${this.path}/${this.conf['saved_network']}`);
			}catch(err){
				throw err;
			}
		}

		// Leggo tutti i file in quella path
		let files = fs.readdirSync(`${this.path}/${this.conf['saved_network']}`);
		data.name = data.name.replace(/ /g, '_');
		
		// Se esiste già la rete caricata
		if(files.includes(`${data.name}.json`)){

			if(this.networks[data.name] !== undefined)
				if(this.networks[data.name].monitoring === true)
					this.deleteFromPool(data.name);

			
			this.networks[data.name] = undefined;

			try{
				fs.unlinkSync(`${this.path}/${this.conf['saved_network']}/${data.name}.json`);
			}catch(err){
				console.log(err);
			}
		}

		if(data.name === undefined)
			throw new Error("[code_error] - Nome della rete non presente !");


		let name = data.name.replace(/ /g, '_').replace(/'/g, '').replace(/"/g, "");
		data.name = data.name.replace(/ /g, '_').replace(/'/g, '').replace(/"/g, "");
		let p = this.path +'/'+ this.conf['saved_network'] +'/'+ name + '.json';

		fs.writeFile(p, JSON.stringify(data, null, "\t"), (err) => {
			if(err){
				console.log(err);
				throw err;
			}
		});

		let check = true;
		try{
			check = this.initDatabaseConnection(data.database)
		}catch(err){
			throw err;
		}

		if(!check)
			console.log("Connessione esistente !");

		
		this.initBayesianNetwork(data);
	}

	/**
	 * Metodo che fa partire il server e rimane in ascolto
	 * per request varie.
	 * @return {}
	 */
	startServer() {
		this.server = this.app.listen(this.port);
		// console.log(`Listening at http://${this.host}:${this.port}`);
		this.initSavedNetworks();
	}


	/**
	 * Metodo per "distruzione" e spegnimento server express
	 * @throws{error}
	 **/
	shutDown() {
		// console.log("Closed kill signal, shutting down gracefully");
		this.server.close(); 
	}


	/**
	 * Inizializza le reti da monitorare salvate.
	 * per request varie.
	 * @return {}
	 */
	initSavedNetworks(){
		let path = this.conf['saved_network'];
		let nets = [];

		try{
			for(let n of fs.readdirSync(`${this.path}/${this.conf['saved_network']}`)){
				if(n.includes('.json')){
					let tmp;
					try{				
						tmp = require(`${this.path}/${this.conf['saved_network']}/${n}`);
						// tmp = JSON.parse(fs.readFileSync(`${this.path}/${this.conf['saved_network']}/${n}`));
					} catch(err){
						throw err;
					}

					this.initBayesianNetwork(tmp);

					if(tmp.name != undefined){
						if(!this.initDatabaseConnection(tmp.database))
							console.log("Database non inizializzato !");
					}
				}
			}
		} catch(err){
			throw err;
		}
	}

	/**
	 * TODO: Da rifare con pool di connesioni ?!
	 * Costruisco la rete bayesiana con la libreria jsbayes e la aggiunge alla lista
	 * @throws {Error}
	 * @return {booelan} true if all it's ok
	 */
	initDatabaseConnection(connection){
		if(this.db[connection.name] != undefined)
			return false;
		else{
			// this.db = new database('142.93.102.115', '8086', 'telegraf');
			let url = connection.url.replace('http://', '');
			url = url.split(":");

			if(url.length != 2)
				throw new Error("[Error_code] - url non corretto !");

			let db_write = 'networks_probabilites';

			if(this.conf.db_write != undefined && this.conf.db_write != '')
				db_write = this.conf.db_write;

			try{
				if(connection.user !== '' && connection.password !== '')
					this.db[connection.name] = new database(url[0], url[1], connection.database, db_write, connection.user, connection.password);
				else
					this.db[connection.name] = new database(url[0], url[1], connection.database, db_write);
			} catch(err){
				console.log(err);
				throw err;
			}

			return true;
		}


	}

	/**
	 * Costruisco la rete bayesiana con la libreria jsbayes e la aggiunge alla lista
	 * @throws {Error}
	 * @return {booelan} true if all it's ok
	 */
	initBayesianNetwork(net) {
		this.networks[net.name] = new Network(net);
		if(this.networks[net.name].monitoring === true)
			this.addToPool(this.networks[net.name].net.name);
	}

	/**
	 * Ritorna il numero di reti bayesiane inizializzate
	 * @return {Number} Number of bayesian networks
	 */
	countNetworks() {
		return Object.keys(this.networks).length;
	}


	/**
	 * Gestisce il il flusso di dati in output dal db
	 * e lo fornisce come input alla rete bayesiana
	 * @return {Number} Number of bayesian networks
	 */
	async observeNetworks(net, data) {
		let r = await this.db[this.networks[net].net.database.name].getListData(data);
		let check = this.networks[net].observeData(r);

		if(check === true && this.networks[net].critica === false) {
			//stop ricalcolo
			clearInterval(this.pool[net].observer)
			//re-start ricalcolo con politica 5s
			this.pool[net].observer = setInterval(this.observeNetworks.bind(this), 5000, net, this.networks[net].dati);
			this.networks[net].critica = true;	
		}
		if(check === false && this.networks[net].critica === true) {
			//uscita soglia critica --> torno alla politica temporale precedentemente settata
			clearInterval(this.pool[net].observer);
			this.networks[net].critica = false;
			this.pool[net].observer = setInterval(this.observeNetworks.bind(this), this.getMilliseconds(this.networks[net].net.temporalPolicy), net, this.networks[net].dati);
		}
		this.writeMesure(net);

	}


	/**
	 * Controlla che nel file di configurazione
	 * ci siano gli attributi obbligatori
	 * @return {booelan} true if all it's ok, false altrimenti
	 */
	static configParser(config) {
		let lista = Object.keys(config);
		let keys = ['saved_network', 'path'];

		for (let key of keys) {
			if (!lista.includes(key))
				return false;
		}

		return true;
	}

	/**
	 * Controlla i parametri obbligatori passati a terminale
	 * @return {booelan} true if all it's ok, false altrimenti
	 */
	static checkParam(argv) {
		let lista = ['p'];
		for (let key of lista) {
			if (argv[key] === undefined)
				return false;
		}
		return true;
	}

	/**
	 * Method used to retrieve all available networks saved with monitoring status.
	 * @return{array} all networks
	 * @throws{error} if reads a not valid file
	 **/
	getNetworks() {
		let tmp = [];
		// open directory
		const items = fs.readdirSync(`${this.path}/${this.conf['saved_network']}`);
		// passing each file
		for (let net of items) {

			if(!net.includes('.json'))
				continue;
			// adding each network
			try {
				const file = JSON.parse(fs.readFileSync(`${this.path}/${this.conf['saved_network']}/${net}`));
				let dict = {};
				dict['name'] = file.name;
				dict['monitoring'] = file.monitoring;
				tmp.push(dict);
			} catch (e) {
				throw e;
			}
		}
		return tmp;
	}


	/**
	 * Return the total amount of ms from temporal policy
	 * @return{int} the number of ms
	 **/
	getMilliseconds(temporal){
		return (temporal.seconds + temporal.minutes*60 + temporal.hours*3600)*1000;
	}

	/**
	 * Add a network in pool
	 * @return{Boolean} true if net is add, false if the network is already in
	 **/
	addToPool(net){

		if(this.pool[net] !== undefined)
			return false;
		// for(let ob of this.pool){
		// 	if(ob !== undefined)
		// 		if(ob.name == net && this.pool[ob.name] !== undefined)
		// 			return false;
		// }

		this.networks[net].monitoring = true;
		let dict = {};
		dict.name = net;
		this.networks[net].interval = setInterval(this.observeNetworks.bind(this), this.getMilliseconds(this.networks[net].net.temporalPolicy), net, this.networks[net].dati);
		dict.observer = this.networks[net].interval ;
		this.pool[net] = dict;
		return true;
	}

	/**
	 * Delete a network from the pool
	 * @return{Boolean} true if net exits and is delete, false otherwise
	 **/
	deleteFromPool(net){
		let check = false;

		if(this.pool[net] === undefined)
			return check;

		clearInterval(this.pool[net].observer);
		check = true;
		delete this.pool[net];
		this.networks[net].monitoring = false; 
		return check;
	}

	/**
	 * Salva le probabilità delle rete nel database salvato all'interno della rete
	 * @return{Boolean}: true se i dati sono stati scritti, false se non ci sono probabilità da salvare
	 * @throws{Error}
	 **/
	writeMesure(net){
		let data = this.networks[net].getProbabilities();

		// Se non ci sono probabilità da inserire ritorno
		if(data[0].prob.length == 0)
			return false;
		try{
			this.db[this.networks[net].net.database.name].writeOnDB(net, data);
		} catch(err){
			if(err)
				throw err;
		}
		return true;
	}

}



module.exports = Server;






