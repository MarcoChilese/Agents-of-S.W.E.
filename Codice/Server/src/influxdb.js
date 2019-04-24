const influx = require('influx');

class InfluxDB{
	
	constructor(host, port, database, db_write, user, pwd){

		if(host === undefined || port === undefined || database === undefined)
			throw new Error("[Error_code] - Check params");
		
		this.host = host; 
		this.port = port; 
		this.database = database; 
		this.dbwrite = db_write; 

		// Init the database connection
		if(user === undefined || pwd === undefined)
			this.db = new influx.InfluxDB(`http://${host}:${port}/${database}`);
		else
			this.db = new influx.InfluxDB(`http://${user}:${pwd}@${host}:${port}/${database}`);
	}


	/*
	* Ritorna i datasources del db collegato 
	* @throws {Error} if db throws error 
	* @return {Promise}
	*/
	getDatasources(){
		const query = `show measurements`;
		return this.queryDB(query); 
	}


	/*
	* Fetch the data  
	* @throws {Error} if db throws error 
	* @return {Promise}
	*/
	async queryDB(query){
		return this.db.query(query); 
	}

	/**
	 * The function return a JSON with all the available fields for the required source in the current database
	 * @param source: a table in the DB
	 * @return {Promise} contains JSON with all the available fields for the required source in the current database
	*/
	getDatasourcesFields(source){
		const query = `show field keys from ${source}`; 
		return this.queryDB(query);
	}


	/**
	 * The function return the value of the last measurement of a particular 
	 * field of a selected datasources
	 * remember to select the [0] from the array
	 * @param {String} source: a table in the DB
	 * @param {String} field: a field in the source
	 * @throws {Error}
	 * @returns {Promise<*>} contains value of the 
	 * last fetched value from the selected datasource
	*/
	getLastValue(source, field){
		const query = `select ${field} from ${source} order by time desc limit 1`;
		try{
			// Adatto il metodo nativo della libreria alla classe
			return this.queryDB(query); 
		} catch(err){
			console.log(err);
			throw err;
		}
	}

	/**
	 * The async function return the value of the last measurement of a particular field of a selected datasources
	 * remember to select the [0] from the array
	 * @param source: a table in the DB
	 * @param field: a field in the source
	 * @returns {Promise<*>} contains value of the last fetched value from the selected datasource
	*/
	async getLastValueAsync(source, field){
		// console.log(source); 
		// console.log(field); 
		const query = `select ${field} from ${source} order by time desc limit 1`;
		
		let data;    
		// process.exit(); 

		try{
			data = await this.queryDB(query);    
		} catch(err){
			console.log(err); 
			// throw err; 
		}
		return data; 
	}

	/**
	 * async function returning a list of last data from influx 
	 * @param {Array} fields: associative array of table and flush 
	 * @returns {Promise<*>} contains value of the last fetched value from the selected datasource
	*/
	async getListData(fields){
		let ris = [];
		let tmp;

		for(let field of fields){
			// TODO: gestire vari errori mancanza dato, eccezzioni ecc 
			try{
				tmp = await this.getLastValueAsync(field.table, field.flush);	
			}catch(err){
				console.log(err);
			}

			ris[field.flush] = tmp[0][field.flush];
		}
		return ris;
	}


	/**
	 * The function insert a value on particular field into a table on a DB
	 * vengono salvati in ordine di come arrivano
	 * @param {String} tableName: the table to write on
	 * @param {String} field: the particular field to insert value
	 * @param {String} value: the value to insert into the field
	*/
	writeOnDB(net, probs){

		// Array di dict 
		let data = []; 
		for(let prob of probs){
			// Creo un dizionario vuoto per inseriri i dati nel formato richiesto 
			let dict = {};

			dict.measurement = `netprobs`;
			dict.tags = { nodo: prob.node };
				
			let counter = 1;
			let fields = {};

			for(let el of prob.prob){
				fields[`valore_${counter}`] = el; 
				// sql +=  `valore_${counter}=${el},`;
				counter += 1;
			}

			dict.fields = fields; 
			data.push(dict); 
			
		}
		
		this.db.writePoints(data, {database: this.dbwrite}).catch(err => {
			console.log(err); 
		});
	}

	/**
	 * Ping the db to check status
	 * @throws {Error}
	 * @returns {Boolean}: true if host is online false other
	*/		
	alive(){
		this.checkStatus(5000).then(host => {
			return host[0].online;
		});
	}

	/**
	 * Pings the hosts, collecting online status and version info.
	 * @param {Number} timeout: timeout to wait the response
	 * @throws {Error}
	 * @returns {Promise<IPingStats[]}: collecting online status and version info.
	*/
	checkStatus(timeout){       
		return this.db.ping(timeout); 

		// Example of use
		// this.db.ping(timeout).then(host => {
		//  if(host[0].online)
		//      console.log(`${host[0].url.host} responded in ${host[0].rtt}ms running ${host[0].version}`)
		//  else
		//      console.log(`${host[0].url.host} is offline :(`);
		// });
	}  
}

module.exports = InfluxDB;

