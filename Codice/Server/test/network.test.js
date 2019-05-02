const request = require('supertest');
const Network = require('../src/Network');
const net = require('./testingNetworks/ViaggioInAsia.json');

let testing_data = []; 
let network_test = new Network(net);



describe('Testing Network class', () => {
	test('Creating new Network', (done) => {
		expect(network_test).not.toBeUndefined();
		expect(network_test.net).not.toBeUndefined(); 
		expect(JSON.stringify(network_test.net)).toMatch(JSON.stringify(net));
		done();
	});

	test('Testing probabilities when pass tresholds', (done) => {
		testing_data['total'] = 3.5; 
		network_test.observeData(testing_data);
		let results = network_test.getProbabilities(); 
		expect(results[2].prob[0]).toBe(1); 
		done();
	});

	test('Testing probabilities when not pass thresholds', (done) => {
		testing_data['total'] = 1.5; 
		let network_test = new Network(net); 
		network_test.observeData(testing_data);
		let results = network_test.getProbabilities(); 
		expect(results[2].prob[0]).not.toBe(1); 
		done();
	});

	// test('Testing critical thresholds', (done) => {
	// 	testing_data['total'] = 1.5
	// 	let network_test = new Network(net);
	// });

}); 


