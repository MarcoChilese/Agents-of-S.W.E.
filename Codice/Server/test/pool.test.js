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


describe('Testing pool system', () => {
	test("Testing init pool of saved networks", () => {
		server.initSavedNetworks();

		for(let net in server.networks)
			expect(server.pool[net]).not.toBeUndefined();
	});


	test("Testing deleting observed network from pool", () => {
		let net = "Alarm";
		expect(server.pool[net]).not.toBeUndefined(); 
		expect(server.deleteFromPool(net)).toBeTruthy();
		expect(server.pool[net]).toBeUndefined(); 
	});

	test("Testing add to pool", () => {
		let net = 'Alarm';
		expect(server.pool[net]).toBeUndefined(); 
		server.addToPool(net);
		expect(server.pool[net]).not.toBeUndefined();
	});

	test("Add existing network on pool", () => {
		let net = 'Alarm';
		expect(server.pool[net]).not.toBeUndefined(); 
		expect(server.addToPool(net)).toBeFalsy();
	});


});


















