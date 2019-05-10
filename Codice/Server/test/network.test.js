const request = require('supertest');
const Network = require('../src/Network');
const net = require('./testingNetworks/ViaggioInAsia.json');
const network = require('./testingNetworks/Sachs.json');

let testing_data = []; 
let network_test = new Network(net);
let sachs = new Network(network); 


describe('Testing Network class', () => {
	test('Creating new Network', (done) => {
		expect(network_test).not.toBeUndefined();
		expect(network_test.net).not.toBeUndefined(); 
		expect(JSON.stringify(network_test.net)).toMatch(JSON.stringify(net));
		done();
	});

	test('Testing probabilities when pass tresholds', (done) => {
		testing_data['inodes_used'] = 100; 
		testing_data['usage_system'] = 100; 
		network_test.observeData(testing_data);
		let results = network_test.getProbabilities();
		expect(results[0].prob[0]).toBe(1); 
		done();
	});

	test('Testing probabilities when not pass thresholds', (done) => {
		testing_data['inodes_used'] = 0.8; 
		testing_data['usage_system'] = 0.5; 
		let network_test = new Network(net); 
		network_test.observeData(testing_data);
		let results = network_test.getProbabilities(); 
		expect(results[2].prob[0]).not.toBe(1); 
		done();
	});

	test('Testing critical thresholds', () => {
		testing_data['inodes_used'] = 1.5
		testing_data['usage_system'] = 0.5; 		
		let network_test = new Network(net);
		let check = network_test.observeData(testing_data); 
		let results = network_test.getProbabilities(); 
		expect(check).toBeTruthy();
	});

	/** 
	* Verifico che il metodo prenda solo le soglie che sono
	* definite in tresholdLinked all'interno della network
	**/
	test("Testing orderTresholds method to gather the right tresholds", (done) => {
		sachs.orderTresholds(); 
		expect(Object.keys(sachs.soglie).length).toBe(1); 
		expect(sachs.soglie['Akt']).not.toBeUndefined(); 
		done(); 
	});



}); 


