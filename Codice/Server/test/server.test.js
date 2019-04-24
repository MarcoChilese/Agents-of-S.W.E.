const path = require('path')
const request = require('supertest');
const app = require('../src/app');
const Server = require('../src/index');
let server = new Server(); 
let database = require('./testingNetworks/Alarm.json'); 
let net_to_load = require('./testingNetworks/ViaggioInAsia.json');
database = database.database; 

expect.extend({
	isJSON(string){
		const pass = false;
		try {
        	const json = JSON.parse(str);
        	if (Object.prototype.toString.call(json).slice(8,-1) !== 'Object') {
        		pass = false;
        }
    	} catch (e) {
        	pass =  false
    	}
    	pass = true;

    	if(pass){
    		return {
    			message: () => 'String pass is json', 
    			pass: true,
    		};
    	}
    	else{
    		return{
    			message: 'String received is not a JSON', 
    			pass: false, 
    		};
    	}
	}
});


describe('Test the path of the express app', () => {

	test('Testing the / path', (done) => {
		request(app.app).get('/').then((response) => {
			expect(response.statusCode).toBe(200); 
			done(); 
		});
	});
	
	test('Testing the /alive path', (done) => {
		request(app.app).get('/alive').then((response) => {
			expect(response.statusCode).toBe(200); 
			done(); 
		});
	});

	test('Check if server has init networks', () => {
		server.initSavedNetworks();
		expect(server).not.toBeUndefined();
		expect(server.networks.length).not.toBeUndefined();
		expect(Object.keys(server.networks).length).toBeGreaterThan(0);	
	});

	test('Testing basic config of runnign server', () => {
		let dir = process.cwd();
		expect(app.path).toMatch(`${dir}/src`);
		expect(app.conf['saved_network']).toMatch('networks');
	});

	test('Testing /uploadnetwork path', async(done) => {
		try{
			let tmp = await request(app.app).post('/uploadnetwork').send(net_to_load);
			expect(tmp.text.replace(/ /g, '')).not.toMatch('ERRORECARICAMENTORETE');
		}catch(err){
			console.log(err);			
		}
		done(); 
	});

	test('good param parserNetworkNameURL method', () => {
		expect(server.parserNetworkNameURL('Alarm')).toMatch('Alarm'); 
		expect(server.parserNetworkNameURL('Viaggio in asia')).toBeFalsy();
	});

	test('bad param parserNetworkNameURL method', () => {
		expect(server.parserNetworkNameURL(null)).toBeFalsy(); 
	});

	test('initDatabaseConnection method', () => {
		expect(Object.keys(server.db).length).toBeGreaterThan(0);
		database.name = "database_prova_jest";
		expect(server.initDatabaseConnection(database)).toBeTruthy();
	});

	test('Testing /networks path', () => {
		request(app.app).get('/networks').then((response) => {
			expect(response.statusCode).toBe(200);
			expect(data.name).toMatch('Viaggio_in_asia');
			done(); 
		});		
	});


	//TU0-0
	// test('Viene verificato che il file di configurazione esista all\' interno della di')
	
});

