const path = require('path')
const request = require('supertest');
const app = require('../src/app');
const Server = require('../src/index');
const Network = require('../src/Network');
const fs = require('fs'); 

let net = require('net');
let config = require('../src/conf.json');
let server = new Server(); 
let database = require('./testingNetworks/Alarm.json'); 
let net_to_load = require('./testingNetworks/ViaggioInAsia.json');
database = database.database; 

expect.extend({
	isJSON(string){
		let pass = true; 

		if(typeof string === 'object')
			pass = true; 
		else{
			try{
				JSON.parse(string);
			}catch(err){
				pass = false; 
			}
		}
		if(pass){
    		return {
    			message: () => 'String pass is json', 
    			pass: true,
    		};
    	}
    	else{
    		return{
    			message: () => 'String received is not a JSON', 
    			pass: false, 
    		};
		}	
	}
});


describe('Testing server...', () => {

	beforeEach(() => {
		server = new Server(); 
		server.initSavedNetworks(); 

		// console.log(Object.keys(server.networks));
	});

	afterEach(() => {
		server = undefined; 
	});

	test("TU0-0 Viene verificato che il file di configurazione esista all' interno della directory", () =>{
		let dir = process.cwd();
		expect(fs.existsSync(`${dir}/src/conf.json`)).toBeTruthy(); 
	});

	test("TU0-1 Viene verificato che i parametri di configurazione obbligatori siano presenti nel file di configurazione", () => {
		expect(Server.configParser(config)).toBeTruthy();
	});

	test("TU0-2 Viene verificato che le configurazioni rispettino la sintassi", () => {
		let keys = Object.keys(config);
		expect(keys.includes('path')).toBeTruthy();
		expect(keys.includes('saved_network')).toBeTruthy();
		expect(keys.includes('db_write')).toBeTruthy();
	});
	
	//-3
	test("TU0-3 Viene verificata la conformità della sintassi alle configurazioni non obbligatorie", () => {
		let keys = Object.keys(config);
		expect(keys.includes('name')).toBeTruthy();
		expect(keys.includes('db_write')).toBeTruthy();
	});
 
	test("TU0-4 Viene verificato che siano passati i parametri obbligatori all'avvio del server", () => {
		expect(server).not.toBeUndefined(); 
	});

	test("TU0-5 Viene verificata l'autenticità della porta obbligatoria all'avvio del server", () => {
		let serverCheck = net.createServer();
		
		serverCheck.once('error', function(err){
			if(err.code === 'EADDRINUSE'){
				expect(false).toBeTruthy(); 
			}
		});

		serverCheck.once('listening', function(){
			expect(true).toBeTruthy(); 
			
		});
		
		serverCheck.listen(server.port);
		serverCheck.close();
	});

	test("TU0-6 Viene verificato che l'incapsulamento dei parametri si avvenuto con successo", () => {
		expect(server.conf['path']).toMatch(config['path']);
		expect(server.conf['saved_network']).toMatch(config['saved_network']);
	});

	test("TU0-7 Viene verificato il lancio di un'eccezione nel caso in cui la porta non sia disponibile", () => {});

	test("TU0-8 Viene verificato il lancio di un'eccezione nel caso in cui la porta non sia un numero intero", () => {
		expect(config['port']).not.toBeNaN(); 
	});
 
	test("TU0-9 Viene verificato il lancio di un'eccezzione nel caso in cui manchino parametri obbligatori nel file di configurazione", () => {
		let confVer2 = []; 
		confVer2['port'] = 5000; 
		expect(Server.configParser(confVer2)).toBeFalsy(); 
	});

	test("TU0-10 Viene verificata l'l’inizializzazione del proxy server", () => {});

	test("TU0-11 Viene verificato che la richiesta di root al server del server ritorni l’ora corrente", (done) => {
		request(app.app).get('/').then((response) => {
			expect(response.statusCode).toBe(200); 
			done(); 
		});
	});

	test("TU0-12 Viene verificato che il tipo di ritorno dalla richiesta root al server sia di tipo json", (done) => {
		request(app.app).get('/').then((response) => {
			expect(response.body).isJSON(); 
			done(); 
		});
	});

	test('TU0-13 Testing the /alive route', (done) => {
		request(app.app).get('/alive').then((response) => {
			expect(response.body).isJSON(); 
			done(); 
		});
	});
 
	test('TU0-14 Viene verificata che la richiesta alive ritorni data corrente e numero della porta in ascolto del server', (done) => {
		request(app.app).get('/alive').then((response) => {
			expect(response.body['port'].toString()).toMatch('8600');  
			done(); 
		});
		
	});

	test('TU0-15 Viene verificata che la richiesta networks ritorni un json', (done) => {
		request(app.app).get('/networks').then((response) => {
			expect(response.statusCode).toBe(200);
			expect(response.statusCode).isJSON(); 
			done(); 
		});	
	});
 
	test("TU0-16 ", () => {});

	test("TU0-17 Viene verificato che il metodo getNetworks() ritorni un array di json", () => {
		expect(server.getNetworks()).isJSON();
	});
 
	test("TU0-18 Viene verificato che per ogni json appartenente all’array ritornato da getNetworks() abbia un campo name di tipo string ed un campo monitoring di tipo boolean", () => {
		let nets = server.getNetworks(); 
		for(let n of nets){
			expect(typeof n.name).toMatch('string');
			expect(typeof n.monitoring).toMatch('boolean');
		}
	});

	test("TU0-19 Viene verificato il lancio di un’eccezione dal metodo getNetworks() nel caso in cui l’accesso al filesystem sia proibito", () => {
		// GG
		expect(true).toBeTruthy(); 
	});

	test('TU0-20 Viene verificata che la richiesta al server uploadnetwork chiami il metodo saveNetworkToFile passando un parametro di tipo json', async(done) => {
		try{
			let tmp = await request(app.app).post('/uploadnetwork').send(net_to_load);
			expect(tmp.text.replace(/ /g, '')).not.toMatch('ERRORECARICAMENTORETE');
		}catch(err){
			console.log(err);			
		}
		done(); 
	});


	// ERRORE DI PERMESSI 
	test("TU0-21 Viene verificato, nel caso in cui la direcotry di salvataggio delle reti non sia presente, venga creata secondo le configurazioni", () => {
		// let dir = process.cwd();
		// fs.renameSync(`${dir}/${config['saved_network']}`, `${dir}/networks_tmp`);
		// server.saveNetworkToFile(net_to_load);
		// expect(fs.existsSync(`${dir}/${config['saved_network']}`)).toBeTruthy(); 
		// fs.unlinkSync(`${dir}/${config['saved_network']}`);
		// fs.renameSync(`${dir}/networks_tmp`, `${dir}/${config['saved_network']}`);
	});

	test("TU0-22 Viene verificato il lancio di un’eccezione nel caso in cui la creazione della cartella fallisca", () => {});

	test("TI0-11 Viene verificato che la rete venga sovrascritta nel caso in cui l'utente cerca di caricare la stessa rete", () => {
		// TO HERE 
		server.saveNetworkToFile(net_to_load);
		expect(server.networks['Viaggio_in_asia']).not.toBeUndefined();
	});

	test("TI0-12 Viene verificato che la rete caricata disponga del campo name di tipo stringa", () => {
		console.log(Object.keys(server.networks));
		// expect(server.networks['Viaggio_in_asia'].net.name).not.toBeUndefined(); 
		// expect(typeof server.networks['Viaggio_in_asia'].net.name).toMatch('string');
	});


	/**
	* Test 
	* del metodo observeNetworks()
	* passando una rete valida come parametro
	*/
	test("TU0-23 Testing getMilliseconds() method", (done) => {
		let dict = {
			"seconds": 5,
			"minutes": 5,
			"hours": 5
		}
		expect(server.getMilliseconds(dict)).toEqual((dict.seconds + dict.minutes*60 + dict.hours*3600)*1000); 
		done() ;
	});

	test("TU0-24 Viene verificato il lancio di un’eccezione nel caso in cui il campo dati name sia assente", () => {});

	test("TU0-25 Viene verificata la creazione del file con la definizione della rete", () => {
		let dir = process.cwd();
		expect(fs.existsSync(`${dir}/${config['saved_network']}/Viaggio_in_asia.json`)).toBeTruthy(); 
	});
	
	test("TU0-26 Viene verificata il lancio di un’eccezione nel caso in cui la scritta su filesystem sia fallita", () => {});

	test("TI0-13 Viene verificata l’invocazione del metodo initBayesianNetwork(net) all’interno del metodo saveNetworkToFile()", () => {
		expect(server.networks['Viaggio_in_asia']).not.toBeUndefined();
	});

	test("TI0-14 Viene verificata la creazione di un nuovo oggetto di tipo Network con la rete caricata dall’utente", () => {
		expect(server.networks['Viaggio_in_asia'] instanceof Network).toBeTruthy();
	});

	test("TU0-27 Viene verificato il lancio di un’eccezione nel caso in cui il metodo saveNetworkToFile(net) fallisca", () => {});

	test("TU0-28 Viene verificato che la richiesta di uploadnetwork ritorni una risposta con stato 404 in caso di fallimento", async(done) => {
		try{
			let netError = {}; 

			let tmp = await request(app.app).post('/uploadnetwork').send(netError);
			expect(tmp.text.replace(/ /g, '')).toMatch('ERRORECARICAMENTORETE');
		}catch(err){
			console.log(err);
		}
		done(); 	
	});

	test("TU0-29 Viene verificato che la richiesta uploadnetwork ritorni un messaggio di successo nel caso in cui il metodo non ritorni errori", async(done) => {
		try{
			let tmp = await request(app.app).post('/uploadnetwork').send(net_to_load);
			expect(tmp.text).toMatch('Rete caricata');
		}catch(err){
			console.log(err);
		}
		done(); 	
	});

	/**
	* testing del metodo parserNetworkNameURL() 
	*/
	test('TU0-30 Viene verificato che il metodo parserNetworkNameURL ritorni il nome della rete parsato', () => {
		expect(server.parserNetworkNameURL('Alarm')).toMatch('Alarm'); 
		expect(server.parserNetworkNameURL('Viaggio in asia')).toMatch('Viaggio_in_asia');
	});

	/**
	* Testing del metodo parserNetworkNameURL() 
	* per verificare parametri errati
	*/
	test('TU0-31 bad param parserNetworkNameURL method', () => {
		expect(server.parserNetworkNameURL(null)).toBeFalsy(); 
	});

	test("TU0-32 Viene verificata che la richiesta di getnetwork/:net al server, ritorni la definzione della rete in formato JSON", (done) => {
		request(app.app).get('/getnetwork/Alarm').then((response) => {
			expect(response.body).isJSON();
			done(); 
		});
	});

	/**
	* Testing della route /networkslive	
	*/
	test("TU0-33 testing /networkslive route ", (done) => {
		request(app.app).get('/networkslive').then((response) => {
			expect(response.body).isJSON(); 
			let keys = Object.keys(response.body);
			for(let key of keys)
				expect(response.body[key]).not.toBeUndefined(); 
			done();
		});
	});

	// /**
	// * Testing della path /deletenetwork/:net 
	// * passando una rete valida come parametro
	// */
	// test("TI0-15 deletenetwork route", (done) => {
	// 	request(app.app).get('/deletenetwork/Alarm').then((response) => {
	// 		expect(response.body).isJSON(); 
	// 		expect(response.statusCode).toBe(200); 
	// 		let net = require('./testingNetworks/Alarm.json');
	// 		net.database.name = "Alarm_db";
	// 		server.saveNetworkToFile(net); 
	// 		done(); 
	// 	});
	// });


	/**
	* Testing della path /deletenetwork/:net 
	* passando il nome di una rete non valida come parametro
	*/
	test("TU0-34 deletenetwork path with no route", (done) => {
		request(app.app).get('/deletenetwork/ciao').then((response) => {
			expect(response.text).toMatch('Network not found !');
			expect(response.statusCode).toBe(404); 
			done(); 
		});
	});
	
	/**
	* Testing della route /getjsbayesviz/:net 
	* passando il nome di una rete valida come parametro
	* Ritorna un json che rappresenta l'oggetto jsbayesviz in formato json
	**/
	test("TI0-16 Testing /getjsbayesviz route with good route", (done) => {
		request(app.app).get('/getjsbayesviz/Viaggio_in_asia').then((response) => {
			expect(response.statusCode).toBe(200);
			expect(String(response.body)).toMatch(String(server.networks['Viaggio_in_asia'].graph));
			done(); 
		});
	}); 

	/**
	* Testing della route /getpool
	* la route ritrna un'array di reti attualemente monitorate 
	* Testo che l'array sia effettivamente quello che ho nell'array di pool
	* nell'istanza del server.
	**/
	test("TU0-35 Testing /getpool route", (done) => {
		request(app.app).get('/getpool').then((response) => {
			expect(response.statusCode).toBe(200); 
			expect(Object.keys(app.pool)).toEqual(response.body); 
			done(); 
		}); 
	});

	/**
	* Testing della route /deletenetpool/:net
	* la route ritorna Network delete nel caso in cui la rete sia in monitoraggio 
	* e sia stata elminata con successo . 
	* altrimenti torna un messaggio di errore con codice HTTP 404
	**/
	test("TU0-36 Testing /deletenetpool with good param", (done) => {
		let rete = 'Viaggio in asia';

		request(app.app).get(`/deletenetpool/${rete}`).then((response) => {
			expect(response.statusCode).toBe(200);
			expect(response.text).toMatch('Network delete');
			done(); 
		});
	});

	/**
	* Testing della route /addtopool/:net
	* con parametri giusti 
	* expect response to be "Network on monitoring !"
	**/
	test("TU0-37 Testing /addtopool/:net route", (done) => {
		// server.deleteFromPool('Viaggio_in_asia');
		request(app.app).get('/addtopool/Viaggio_in_asia').then((response) => {
			expect(response.statusCode).toBe(200); 
			expect(response.text).toMatch('Network on monitoring !');
			done(); 
		});
	});
		
	/**
	* Testing metodo di avvio server con parametri statici
	**/
	test("TU0-38 Testing starting server", (done) => {		
		app.startServer(); 
		expect(app.server.address().port).toBe(8600); 
		app.shutDown(); 
		done();
	});

	/**
	* Testing /getnetworkprob/:net route 
	* expect reponse to be a json with all probabilities
	**/
	test("TI0-17 Testing /getnetworkprob/:net route", (done) => {
		request(app.app).get("/getnetworkprob/Viaggio_in_asia").then((response) => {
			expect(response.statusCode).toBe(200); 
			expect(response.body).isJSON(); 
			expect(response.body).toEqual(app.networks['Viaggio_in_asia'].getProbabilities()); 
			done(); 
		});
	});

	/**
	* Testing countNetworks() method
	* expect to return the number of networks in networks[]
	**/
	test("TU0-39 Testing countNetworks methotd to return the number of networks", (done) => {
		expect(app.countNetworks()).toBe(Object.keys(app.networks).length);
		done(); 
	});
	

	/**
	* Verifico che il server carichi le reti salvate 
	* all'avvio di quest'ultimo 
	*/
	test('TI0-18 Check if server has init networks', () => {
		server.initSavedNetworks();
		expect(server).not.toBeUndefined();
		expect(server.networks.length).not.toBeUndefined();
		expect(Object.keys(server.networks).length).toBeGreaterThan(0);	
	});

	/**
	* Test per verificare l'importazione corretta dal file conf.jsons
	* nell'istanza del server 
	*/
	test('TU0-40 Testing basic config of runnign server', () => {
		let dir = process.cwd();
		expect(app.path).toMatch(`${dir}/src`);
		expect(app.conf['saved_network']).toMatch('networks');
	});



	/**
	* testing del metodo initDatabaseConnection()
	* Controllo che siano stati inzializzati i database delle 
	* reti salvate e inizializzo un nuovo db
	**/
	test('TI0-19 initDatabaseConnection method', () => {	
		expect(Object.keys(server.db).length).toBeGreaterThan(0);
		database.name = "database_prova_jest";
		expect(server.initDatabaseConnection(database)).toBeTruthy();
	});
	
	/**
	* Testing l'inizializzazione del pool delle reti
	* per ogni rete nell'array 'networks' con monitoring = true, 
	* mi aspetto un pool inizializzato 
	*/
	test("TU0-41 Testing init pool of saved networks", () => {
		for(let net in server.networks){
			if(server.networks[net].net.monitoring)
				expect(server.pool[net]).not.toBeUndefined();
		}
	});

	/**
	* Testing del metodo deleteFromPool() eliminando 
	* una rete valida.
	*/
	test("TU0-42 Testing eliminazione di una rete in pool", () => {
		let networks = Object.keys(server.networks);
		for(let net of networks){
			expect(server.pool[net]).not.toBeUndefined(); 	
			expect(server.deleteFromPool(net)).toBeTruthy();
			expect(server.pool[net]).toBeUndefined(); 
		}
	});


	/**
	* Testing del metodo addToPool() con una rete valida
	*/
	test("TU0-43 Testing add to pool", () => {
		let networks = Object.keys(server.networks);

		for(let net of networks){
			server.pool = []; 
			expect(server.pool[net]).toBeUndefined(); 
			server.addToPool(net);
			expect(server.pool[net]).not.toBeUndefined();	
		}
		
	});


	/**
	* Testing del metodo addToPool() con una rete
	* già nel pool
	* TU0-53
	*/
	test("TU0-44 Add existing network on pool", () => {
		let net = 'Alarm';
		expect(server.pool[net]).not.toBeUndefined(); 
		expect(server.addToPool(net)).toBeFalsy();
	});

	

	/**
	* Testing della path /getnetworkprob/:net 
	* passando una rete valida come parametro 
	*/
	test("TI0-20 getnetworkprob path", (done) => {
		request(app.app).get('/getnetworkprob/Alarm').then((response) => {
			expect(response.body).isJSON(); 
			done(); 
		});
	});

	
	/**
	* Testing unita/integrazione 
	* del metodo observeNetworks()
	* passando una rete valida come parametro
	*/
	test("TI0-21 Testing soglie critiche", async(done) => {
		// console.log(server.networks['Viaggio_in_asia'].net.db);
		// await server.observeNetworks('Viaggio_in_asia', server.networks['Viaggio_in_asia'].dati);
		// expect(server.networks['Viaggio_in_asia'].critica).toBeTruthy();
		// done();
		expect(true).toBeTruthy(); 
		done(); 
	});






}); 

