const InfluxDB = require('../src/influxdb');
let user = "greg"; 
let pwd = "greg"; 
let ip = "142.93.102.115";
let port = 8086;
let db = 'telegraf';
let db_write = 'networks_probabilites_testing';
let con; 


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

	test("Constructor with user and password", async(done) => {
		con = new InfluxDB(ip, port, db, db_write, user, pwd);
		let tmp = await con.checkStatus(1000); 
		expect(tmp[0].online).toBeTruthy(); 
		done(); 
	});

	test("Constructor", async(done) => {
		con = new InfluxDB(ip, port, db, db_write);
		let tmp = await con.checkStatus(1000);
		expect(tmp[0].online).toBeTruthy(); 
		done();
	});

	test("getDatasources method", async(done) => {
		let tmp = await con.getDatasources(); 
		expect(tmp).not.toBeUndefined(); 
		done();
	});

	test("getDatasourcesFields method", async(done) => {
		let tmp = await con.getDatasourcesFields('cpu');
		expect(tmp).isJSON(); 
		for(let t of tmp)
			expect(t.fieldType).toMatch('float');

		done(); 
	});

	test("getLastValue method", async(done) => {
		let tmp = await con.getLastValue('cpu', 'usage_system');
		expect(tmp[0].usage_system).not.toBeNaN(); 
		done(); 
	});

	test("getLastValueAsync method", async(done) => {
		let tmp = await con.getLastValueAsync('cpu', 'usage_system');
		expect(tmp[0].usage_system).not.toBeNaN(); 
		done(); 
	});

	test("getListData method", async(done) => {
		let data = [{ table: 'cpu', flush: 'usage_nice' }];
		let tmp = await con.getListData(data); 
		console.log(tmp);
		expect(tmp['usage_nice']).not.toBeUndefined(); 
		done(); 
	});

	test("Constructor connection for write_db", async(done) => {
		let conWrite = new InfluxDB(ip, port, db_write, db_write); 
		let tmp = await conWrite.checkStatus(1000);
		expect(tmp[0].online).toBeTruthy(); 
		done();
	});

	test("Write probabilities on influx", async(done) => {
		let conWrite = new InfluxDB(ip, port, db_write, db_write); 
		con.writeOnDB('testing_network', [{ node: 'SHUNT', states: [ 'TRUE', 'FALSE' ], prob: [ 0.980, 0.200 ] }]); 
		let data = [{ table: 'netprobs', flush: 'valore_1' }, { table: 'netprobs', flush: 'valore_2' }];
		let tmp = await conWrite.getListData(data);
		expect(tmp.valore_1).toBe(0.98);
		expect(tmp.valore_2).toBe(0.2);
		done();
	});

	test("Try throw exception in constructor params", () => {
		expect(() => {
			let conFail = new InfluxDB(ip, 'NaN', db, db_write);
		}).toThrow(); 
	});

});



















