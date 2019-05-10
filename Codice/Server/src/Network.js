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

		//true se viene superata una soglia critica
		this.critica = false;

		this.temporalPolicy = net.temporalPolicy;
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

			if(net.flushesAssociations[node] != undefined)
				this.dati.push(net.flushesAssociations[node]);
		}
		
		this.orderTresholds();  
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

	/**
	* unobserve tutti i nodi della rete bayesiana
	**/
	unobserveAll(){
		for(let nodo of this.net.nodes)
			this.graph.unobserve(nodo);
	}


	// set soglie in ordine 
	orderTresholds(){
		let dict = {}; 
	
		// per ogni nodo che è collegato al flusso di dati
		for(let node in this.net.tresholdLinked){
			if(!this.net.tresholdLinked[node])
				continue; 

			// Creazione del dizionario con la 
			// suddivisione di maggiore e minore
			dict[node] = {}; 
			dict[node].maggiore = []; 
			dict[node].minore = []; 
			
			for(let stato of this.net.tresholds[node]){
				if(stato.sign == '>' || stato.sign == '>=')
					dict[node].maggiore.push(stato); 
				else
					dict[node].minore.push(stato); 
			}

			// Funzione di comparazione
			dict[node].maggiore.sort(function(a, b){
				return b.value - a.value;
			});

			dict[node].minore.sort(function(a, b){
				return a.value - b.value;
			});
		}
		this.soglie = dict;
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

		// do_maggiore: se supero una soglia nell'array di minori non eseguo l'array di maggiori
		let do_maggiore = true; 
		
		this.unobserveAll(); 
		// console.log(this.soglie);

		for(let soglia in this.soglie){
			// prendo il dato da confrontare con le soglie 
			let dato_monitorato = dati[this.net.flushesAssociations[soglia].flush];
			
			for(let parametri of this.soglie[soglia].minore){

				if(parametri.sign == "<="){
					if(dato_monitorato <= parametri.value){
						do_maggiore = false; 
						critico = (parametri.critical ? critico || true : critico);
						this.observe(soglia, parametri.state);
						// Se si verifica il superamento di una soglia
						// non verifico le altre 
						break; 
					}
				}
				if(parametri.sign == "<"){
					if(dato_monitorato < parametri.value){
						do_maggiore = false; 
						critico = (parametri.critical ? critico || true : critico);
						this.observe(soglia, parametri.state);
						break; 
					}
				}	
			}
			// se si verifica una soglia tra le minori non eseguo il ciclo dei maggiori
			if(do_maggiore){
				for(let parametri of this.soglie[soglia].maggiore){
					if(parametri.sign == ">="){
						if(dato_monitorato >= parametri.value){
							critico = (parametri.critical ? critico || true : critico);
							this.observe(soglia, parametri.state);
							break; 
						}
					}
					if(parametri.sign == ">"){
						if(dato_monitorato > parametri.value){
							critico = (parametri.critical ? critico || true : critico);
							this.observe(soglia, parametri.state);
							break; 
						}
					}	
				}
			}
		}

		this.sample(1000);
		return critico;

	}

	
	/**
	* Ritorna un'array di probabilità calcolate nella rete 
	**/
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











