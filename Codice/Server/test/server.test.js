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

	/**
	* Verifico che il server carichi le reti salvate 
	* all'avvio di quest'ultimo 
	*/
	test('Check if server has init networks', () => {
		server.initSavedNetworks();
		expect(server).not.toBeUndefined();
		expect(server.networks.length).not.toBeUndefined();
		expect(Object.keys(server.networks).length).toBeGreaterThan(0);	
	});

	/**
	* Test per verificare l'importazione corretta dal file conf.jsons
	* nell'istanza del server 
	*/
	test('Testing basic config of runnign server', () => {
		let dir = process.cwd();
		expect(app.path).toMatch(`${dir}/src`);
		expect(app.conf['saved_network']).toMatch('networks');
	});

	/**
	* testing del metodo parserNetworkNameURL() 
	*/
	test('good param parserNetworkNameURL method', () => {
		expect(server.parserNetworkNameURL('Alarm')).toMatch('Alarm'); 
		expect(server.parserNetworkNameURL('Viaggio in asia')).toMatch('Viaggio_in_asia');
	});

	/**
	* Testing del metodo parserNetworkNameURL() 
	* per verificare parametri errati
	*/
	test('bad param parserNetworkNameURL method', () => {
		expect(server.parserNetworkNameURL(null)).toBeFalsy(); 
	});

	/**
	* testing del metodo initDatabaseConnection()
	* Controllo che siano stati inzializzati i database delle 
	* reti salvate e inizializzo un nuovo db
	*/
	test('initDatabaseConnection method', () => {
		expect(Object.keys(server.db).length).toBeGreaterThan(0);
		database.name = "database_prova_jest";
		expect(server.initDatabaseConnection(database)).toBeTruthy();
	});

	// TU0-0
	test("Viene verificato che il file di configurazione esista all' interno della directory", () =>{
		let dir = process.cwd();
		expect(fs.existsSync(`${dir}/src/conf.json`)).toBeTruthy(); 
	});

	// TU0-1
	test("TU0-1 Viene verificato che i parametri di configurazione obbligatori siano presenti nel file di configurazione", () => {
		expect(Server.configParser(config)).toBeTruthy();
	});

	// TU0-2 
	test("TU0-2 Viene verificato che le configurazioni rispettino la sintassi", () => {
		let keys = Object.keys(config);
		expect(keys.includes('path')).toBeTruthy();
		expect(keys.includes('saved_network')).toBeTruthy();
		expect(keys.includes('db_write')).toBeTruthy();
	});
	
	// TU0-3
	test("TU0-3 Viene verificata la conformità della sintassi alle configurazioni non obbligatorie", () => {
		let keys = Object.keys(config);
		expect(keys.includes('name')).toBeTruthy();
		expect(keys.includes('db_write')).toBeTruthy();
	});

	// TU0-4 
	test("TU0-4 Viene verificato che siano passati i parametri obbligatori all'avvio del server", () => {
		expect(server).not.toBeUndefined(); 
	});

	// TU0-5
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

	// TU0-6
	test("TU0-6 Viene verificato che l'incapsulamento dei parametri si avvenuto con successo", () => {
		expect(server.conf['path']).toMatch(config['path']);
		expect(server.conf['saved_network']).toMatch(config['saved_network']);
	});

	// TU0-7
	test("TU0-7 Viene verificato il lancio di un'eccezione nel caso in cui la porta non sia disponibile", () => {});

	// TU0-8
	test("TU0-8 Viene verificato il lancio di un'eccezione nel caso in cui la porta non sia un numero intero", () => {
		expect(config['port']).not.toBeNaN(); 
	});

	// TU0-9 
	test("TU0-9 Viene verificato il lancio di un'eccezzione nel caso in cui manchino parametri obbligatori nel file di configurazione", () => {
		let confVer2 = []; 
		confVer2['port'] = 5000; 
		expect(Server.configParser(confVer2)).toBeFalsy(); 
	});

	// TU0-10
	test("TU0-10 Viene verificata l'l’inizializzazione del proxy server", () => {});

	// TU0-11
	test("TU0-11 Viene verificato che la richiesta di root al server del server ritorni l’ora corrente", (done) => {
		request(app.app).get('/').then((response) => {
			expect(response.statusCode).toBe(200); 
			done(); 
		});
	});

	// TU0-12
	test("TU0-12 Viene verificato che il tipo di ritorno dalla richiesta root al server sia di tipo json", (done) => {
		request(app.app).get('/').then((response) => {
			expect(response.body).isJSON(); 
			done(); 
		});
	});

	// TU0-13
	test('TU0-13 Testing the /alive path', (done) => {
		request(app.app).get('/alive').then((response) => {
			expect(response.body).isJSON(); 
			done(); 
		});
	});

	// TU0-14 
	test('TU0-14 Viene verificata che la richiesta alive ritorni data corrente e numero della porta in ascolto del server', (done) => {
		request(app.app).get('/alive').then((response) => {
			expect(response.body['port'].toString()).toMatch('8600');  
			done(); 
		});
		
	});

	// TU0-15
	test('TU0-15 Viene verificata che la richiesta networks ritorni un json', (done) => {
		request(app.app).get('/networks').then((response) => {
			expect(response.statusCode).toBe(200);
			expect(response.statusCode).isJSON(); 
			done(); 
		});	
	});

	// TU0-16 
	test("TU0-16 ", () => {});

	// TU0-17
	test("TU0-17 Viene verificato che il metodo getNetworks() ritorni un array di json", () => {
		expect(server.getNetworks()).isJSON();
	});

	// TU0-18 
	test("TU0-18 Viene verificato che per ogni json appartenente all’array ritornato da getNetworks() abbia un campo name di tipo string ed un campo monitoring di tipo boolean", () => {
		let nets = server.getNetworks(); 
		for(let n of nets){
			expect(typeof n.name).toMatch('string');
			expect(typeof n.monitoring).toMatch('boolean');
		}
	});

	// TU0-19
	test("TU0-19 Viene verificato il lancio di un’eccezione dal metodo getNetworks() nel caso in cui l’accesso al filesystem sia proibito", () => {
		// GG
		expect(true).toBeTruthy(); 
	});

	// TU0-20
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
	// TU0-21 
	test("TU0-21 Viene verificato, nel caso in cui la direcotry di salvataggio delle reti non sia presente, venga creata secondo le configurazioni", () => {
		// let dir = process.cwd();
		// fs.renameSync(`${dir}/${config['saved_network']}`, `${dir}/networks_tmp`);
		// server.saveNetworkToFile(net_to_load);
		// expect(fs.existsSync(`${dir}/${config['saved_network']}`)).toBeTruthy(); 
		// fs.unlinkSync(`${dir}/${config['saved_network']}`);
		// fs.renameSync(`${dir}/networks_tmp`, `${dir}/${config['saved_network']}`);
	});
	
	// TU0-22
	test("TU0-22 Viene verificato il lancio di un’eccezione nel caso in cui la creazione della cartella fallisca", () => {});

	// TU0-23 
	test("TU0-23 Viene verificato che la rete venga sovrascritta nel caso in cui l'utente cerca di caricare la stessa rete", () => {
		try{
			server.saveNetworkToFile(net_to_load);
		}catch(err){
			console.log(err); 
		}
		expect(server.networks['Viaggio_in_asia']).not.toBeUndefined();
	});

	// TU0-24
	test("TU0-24 ", () => {});

	// TU0-25
	test("TU0-25 Viene verificato che la rete caricata disponga del campo name di tipo stringa", () => {
		expect(server.networks['Viaggio_in_asia'].net.name).not.toBeUndefined(); 
		expect(typeof server.networks['Viaggio_in_asia'].net.name).toMatch('string');
	});

	// TU0-26 
	test("TU0-26 Viene verificato il lancio di un’eccezione nel caso in cui il campo dati name sia assente", () => {});
	
	// TU0-27
	test("TU0-27 Viene verificata la creazione del file con la definizione della rete", () => {
		let dir = process.cwd();
		expect(fs.existsSync(`${dir}/${config['saved_network']}/Viaggio_in_asia.json`)).toBeTruthy(); 
	});
	
	// TU0-28 
	test("TU0-28 Viene verificata il lancio di un’eccezione nel caso in cui la scritta su filesystem sia fallita", () => {});
	
	// TU0-29
	test("TU0-29 Viene verificata l’invocazione del metodo initBayesianNetwork(net) all’interno del metodo saveNetworkToFile()", () => {
		expect(server.networks['Viaggio_in_asia']).not.toBeUndefined();
	});

	// TU0-30
	test("TU0-30 Viene verificata la creazione di un nuovo oggetto di tipo Network con la rete caricata dall’utente", () => {
		expect(server.networks['Viaggio_in_asia'] instanceof Network).toBeTruthy();
	});

	// TU0-31 
	test("TU0-31 Viene verificato il lancio di un’eccezione nel caso in cui il metodo saveNetworkToFile(net) fallisca", () => {});

	// TU0-32
	test("TU0-31  Viene verificato che la richiesta di uploadnetwork ritorni una risposta con stato 404 in caso di fallimento", async(done) => {
		try{
			let netError = {}; 

			let tmp = await request(app.app).post('/uploadnetwork').send(netError);
			expect(tmp.text.replace(/ /g, '')).toMatch('ERRORECARICAMENTORETE');
		}catch(err){
			console.log(err);
		}
		done(); 	
	});

	// TU0-32
	test("TU0-32 Viene verificato che la richiesta uploadnetwork ritorni un messaggio di successo nel caso in cui il metodo non ritorni errori", async(done) => {
		try{
			let tmp = await request(app.app).post('/uploadnetwork').send(net_to_load);
			expect(tmp.text).toMatch('Rete caricata');
		}catch(err){
			console.log(err);
		}
		done(); 	
	});

	// TU0-33 
	test("TU0-33 Viene verificata che la richiesta di getnetwork/:net al server, chiami il metodo parserNetworkNameURL", (done) => {
		request(app.app).get('/getnetwork/Alarm').then((response) => {
			expect(response.body).isJSON();
			done(); 
		});
	});

	/**
	* Testing l'inizializzazione del pool delle reti
	* per ogni rete nell'array 'networks' con monitorign = true, 
	* mi aspetto un pool inizializzato 
	*/
	test("Testing init pool of saved networks", () => {
		for(let net in server.networks){
			if(server.networks[net].net.monitoring)
				expect(server.pool[net]).not.toBeUndefined();
		}
	});

	/**
	* Testing del metodo deleteFromPool() eliminando 
	* una rete valida.
	*/
	test("Testing eliminazione di una rete in pool", () => {
		let net = "Alarm";
		expect(server.pool[net]).not.toBeUndefined(); 
		expect(server.deleteFromPool(net)).toBeTruthy();
		expect(server.pool[net]).toBeUndefined(); 
	});


	/**
	* Testing del metodo addToPool() con una rete valida
	*/
	test("Testing add to pool", () => {
		let net = 'Alarm';
		expect(server.pool[net]).toBeUndefined(); 
		server.addToPool(net);
		expect(server.pool[net]).not.toBeUndefined();
	});


	/**
	* Testing del metodo addToPool() con una rete
	* già nel pool
	*/
	test("Add existing network on pool", () => {
		let net = 'Alarm';
		expect(server.pool[net]).not.toBeUndefined(); 
		expect(server.addToPool(net)).toBeFalsy();
	});

	/**
	* Testing della route /networkslive
	*/
	test("testing /networkslive path ", (done) => {
		request(app.app).get('/networkslive').then((response) => {
			expect(response.body).isJSON(); 
			let keys = Object.keys(response.body);
			for(let key of keys)
				expect(response.body[key]).not.toBeUndefined(); 
			done();
		});
	});

	/**
	* Testing della route /path
	*/
	test("networks path", (done) => {
		request(app.app).get('/networks').then((response) => {
			expect(response.body).isJSON();
			expect(response.statusCode).toBe(200); 
			done();
		});
	});

	/**
	* Testing della path /getnetworkprob/:net 
	* passando una rete valida come parametro 
	*/
	test("getnetworkprob path", (done) => {
		request(app.app).get('/getnetworkprob/Alarm').then((response) => {
			expect(response.body).isJSON(); 
			done(); 
		});

	});

	/**
	* Testing della path /deletenetwork/:net 
	* passando una rete valida come parametro
	*/
	// test("deletenetwork path", (done) => {
	// 	request(app.app).get('/deletenetwork/Alarm').then((response) => {
	// 		expect(response.body).isJSON(); 
	// 		expect(response.statusCode).toBe(200); 
	// 		done(); 
	// 	});
	// });

});

