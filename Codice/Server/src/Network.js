const jsbayes = require('jsbayes');

class Network{
	constructor(net){
		// net is the json network
		this.net = net;
		// g is the bayesian graph
		this.graph = jsbayes.newGraph();
		
		// boolean to start the monitoring
		this.monitoring = net.monitoring;

		// Init delle soglie
		this.soglie = [];

		// Tutti i dati dal db necessari
		this.dati = [];

		this.temporalPolicy = -1; 		
		// Creazione dei nodi (nodo = 0,1,2,3,4, ecc..)
		
		
		for(const nodo of net.nodes)
			this.graph.addNode(nodo, net.states[nodo]);


		for(let node of net.nodes){

			// console.log(net.parents[node]);
			for(let parent in net.parents[node]){
				this.graph.node(node).addParent(this.graph.node(net.parents[node][parent]));
			}

			if(net.probabilities[node].length == 1)
				this.graph.node(node).setCpt(net.probabilities[node][0]);
			else
				this.graph.node(node).setCpt(net.probabilities[node]);

			if(net.tresholds[node] != undefined && net.tresholds[node].length != 0)
				this.soglie[node] = net.tresholds[node];

			if(net.flushesAssociations[node] != undefined)
				this.dati.push(net.flushesAssociations[node]);
	
		}
	}

	/*
	* Wrapper del metodo jsbayes.observer(node, state);
	*/
	observe(node, state){
		this.graph.observe(node, state);
	}

	/*
	* Wrapper del metodo jsbayes.sample(n);
	*/
	sample(n){
		this.graph.sample(n);
	}


	unobserveAll(){
		for(let nodo of this.net.nodes)
			this.graph.unobserve(nodo);
	}

	/*
	* richiama il metodo observe per ogni nodo in base alle soglie
	* e ai dati ricavati dal db
	* @param {Array} dati: array (associativo!) di tutti i dati collegati al flusso di dati
	*/
	observeData(dati){

		// per ogni treasholds degli elementi da osservare
		// se il segno della treashold è minore allora metto nella lista min
		// min.push(treashold dell'elemento da osservare)
		// else mag.push(treashold dell'elemento da osservare)
		// mag.sort function(a, b){return b.number - a.number}
		// let value = x.results[0].series[0].values[0][1];

		// Perche prima fai "unobserve" !?!?!?
		// for(const el in net.nodes)
		// this.graph.unobserve(net.nodes[el]);
		let critico = false; 

		// Per ogni soglia
		this.unobserveAll();

		for(let soglia in this.soglie){
			let dato_monitorato = dati[this.net.flushesAssociations[soglia].flush];
		
			for(let parametri of this.soglie[soglia]){
			
				// 1 controllo la probabilità con la soglia
				// 2 controllo il flusso di dati con la soglia
				// prendo il flusso associato che monitoro flushesAssociation
				if(parametri.sign == "<="){
					if(dato_monitorato <= parametri.value){
						critico = (parametri.critical ? critico || true : critico || false);
						this.observe(soglia, parametri.state);
					}
				}

				if(parametri.sign == ">="){
					if(dato_monitorato >= parametri.value){
						critico = (parametri.critical ? critico || true : critico || false);
						this.observe(soglia, parametri.state);
					}
				}

				if(parametri.sign == "<"){
					if(dato_monitorato < parametri.value){
						critico = (parametri.critical ? critico || true : critico || false);
						this.observe(soglia, parametri.state);
					}
				}

				if(parametri.sign == ">"){
					if(dato_monitorato > parametri.value){
						critico = (parametri.critical ? critico || true : critico || false);
						this.observe(soglia, parametri.state);
					}
				}

			}
		}
		this.sample(1000);
		return critico;
	}

	/*
	* ritorna le probabilità calcolate
	* @return {Array}
	*/
	getProbabilities(){
		let data = [];

		for(const el of this.net.nodes){
			let tmp = {}; 
			tmp.node = el; 
			tmp.states = this.net.states[el];
			tmp.prob = this.graph.node(el).probs();  
			data.push(tmp);
		}
		return data;
	}
}

module.exports = Network;

// let n = new Network(net);
// console.log(n.getProbabilities());
// n.observeData([]);
// console.log(n.dati);











