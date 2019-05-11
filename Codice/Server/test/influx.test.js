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
	
	/**
	* TU0-55 Testing del costruttore con user and password
	*/
	test("TU0-55 Constructor with user and password", async(done) => {
		con = new InfluxDB(ip, port, db, db_write, user, pwd);
		let tmp = await con.checkStatus(1000); 
		expect(tmp[0].online).toBeTruthy(); 
		done(); 
	});

	/**
	* TU0-56 Testing del costruttore senza user & password
	*/
	test("TU0-56 Constructor", async(done) => {
		con = new InfluxDB(ip, port, db, db_write);
		let tmp = await con.checkStatus(1000);
		expect(tmp[0].online).toBeTruthy(); 
		done();
	});

	/**
	* TU0-57 Testing del costruttuore con parametri sbagliati
	*/
	test("TU0-57 Bad Constructor", async(done) => {
		expect(() => {
			let tmp = new InfluxDB(ip, '', '', ''); 
		}).toThrow();
		done(); 
	});
	/**
	* TU0-58 Testing del metodo getDatasources()
	*/
	test("TU0-58 getDatasources method", async(done) => {
		let tmp = await con.getDatasources(); 
		expect(tmp).not.toBeUndefined(); 
		done();
	});

	/**
	* TU0-59 Viene verificato che il metodo getDatasourcesFields(tabella) ritorni un array di valori in formato json
	*/
	test("TU0-59 getDatasourcesFields method", async(done) => {
		let tmp = await con.getDatasourcesFields('cpu');
		expect(tmp).isJSON(); 
		for(let t of tmp)
			expect(t.fieldType).toMatch('float');

		done(); 
	});

	/**
	* TU0-60 viene verificato che il metodo getLastValue(tabella,flusso) ritorni l'ultimo valore della tabella e del flusso selezionato
	*/
	test("TU0-60 getLastValue method", async(done) => {
		let tmp = await con.getLastValue('cpu', 'usage_system');
		expect(tmp[0].usage_system).not.toBeNaN(); 
		done(); 
	});

	/**
	* TU0-61 viene verificato che il metodo getLastValueasync(tabella,flusso) ritorni l'ultimo valore della tabella e del flusso selezionato
	*/
	test("TU0-61 getLastValueAsync method", async(done) => {
		let tmp = await con.getLastValueAsync('cpu', 'usage_system');
		expect(tmp[0].usage_system).not.toBeNaN(); 
		done(); 
	});

	/**
	* TU0-62 viene verificato che il metodo getListData(data) ritorni i valori della tabella e del flusso selezionato
	*/
	test("TU0-62 getListData method", async(done) => {
		let data = [{ table: 'cpu', flush: 'usage_nice' }];
		let tmp = await con.getListData(data); 
		console.log(tmp);
		expect(tmp['usage_nice']).not.toBeUndefined(); 
		done(); 
	});

	/**
	* TU0-63 viene verificata la costruzione di una connessione con un database influx per la scrittura di dati
	*/
	test("TU0-63 Constructor connection for write_db", async(done) => {
		let conWrite = new InfluxDB(ip, port, db_write, db_write); 
		let tmp = await conWrite.checkStatus(1000);
		expect(tmp[0].online).toBeTruthy(); 
		done();
	});

	/**
	* TU0-64 viene verificato che il metodo writeOnDB(tabella,valori) scriva correttamente nel database
	*/
	test("TU0-64 Write probabilities on influx", async(done) => {
		let conWrite = new InfluxDB(ip, port, db_write, db_write); 
		con.writeOnDB('testing_network', [{ node: 'SHUNT', states: [ 'TRUE', 'FALSE' ], prob: [ 0.980, 0.200 ] }]); 
		let data = [{ table: 'netprobs', flush: 'valore_1' }, { table: 'netprobs', flush: 'valore_2' }];
		let tmp = await conWrite.getListData(data);
		expect(tmp.valore_1).toBe(0.98);
		expect(tmp.valore_2).toBe(0.2);
		done();
	});

	/**
	* TU0-65 viene verificato che la connessione al database con parametri errati, non avvenga correttamente
	*/
	test("TU0-65 Try throw exception in constructor params", () => {
		expect(() => {
			let conFail = new InfluxDB(ip, 'NaN', db, db_write);
		}).toThrow(); 
	});

});



















