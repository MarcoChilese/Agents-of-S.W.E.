/*
 * File: parserTest.test.js
 * Creation date: 2019-03-24
 * Author: Diego Mazzalovo
 * Type: ECMAScript 6
 * Author e-mail: diego.mazzalovo@studenti.unipd.it
 * Version: 0.0.1
 * Changelog:
 * 0.0.1 || Diego Mazzalovo || 2019-03-24 || Sviluppo file
 */

import Parser from '../src/js/parser';

/* correct definition of network
 * Data una rete ben definita viene testata la sua definizione attraverso una validazione.
 * Must return TRUE.
*/

test('Test correct definition of a Network', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };

  const parser = new Parser(network);
  expect(parser.validateNet()).toBe(true);
});


/* test checkMinimumFields method
 * Data una rete ben formata viene controlloto che abbia ESATTAMENTE 5 campi (name, nodes, states, parents e probabilities).
 * Must return TRUE.
*/

test('Test check if JSON file has exactly 5 fields', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };

  const parser = new Parser(network);
  expect(parser.checkMinimumFields()).toBe(true);
});


/* test checkMinimumFields method
 * Data una rete NON ben formata viene controllato che il metodo riconosca il fatto che il numero di campi è errato.
 * Must return FALSE.
*/

test('Test check if JSON file has more or less than 5 fields', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };

  const errated = network;
  errated.plus = {};
  const parser = new Parser(errated);
  expect(parser.checkMinimumFields()).toBe(false);
});


/* test checkMinimumFields method
 * Data una rete NON ben formata viene controllato che il metodo riconosca il fatto che un campo dati ha una nomenclatura errata.
 * Must return message error: '[Error_code] - Incorrect states definition'.
*/

test('Test check if JSON file has a wrong named field', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    wrong: {},
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  try {
    const parser = new Parser(network);
    parser.checkMinimumFields();
  } catch (e) {
    expect(e.message).toBe('[Error_code] - Incorrect states definition');
  }
});

/* test checkNamedNodes
 * Data una rete NON ben formata viene controllato che il metodo riconosca che un certo campo ha un numero di righe sbagliato nella definizione degli stati.
 * Must return message error: '[Error_code] - Incorrect number of lines in states definition'.
*/
test('Test check if a JSON field has wrong number of lines', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
        pippo: 'pluto',
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  try {
    const parser = new Parser(network);
    parser.checkNamedNodes(network, 'states');
  } catch (e) {
    expect(e.message).toBe('[Error_code] - Incorrect number of lines in states definition');
  }
});


test('Test check if a JSON field has  wrong names in lines', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronca: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  try {
    const parser = new Parser(network);
    parser.checkNamedNodes(network.states, 'states');
  } catch (e) {
    expect(e.message).toBe('[Error_code] - Missing node Bronchite in states\' definition.');
  }
});


/* test checkNamedNodes
 * Data una rete NON ben formata viene controllato che il metodo riconosca che una certa riga di un campo ha nomenclatura sbagliata.
 * Must return message error: .
*/

test('Test check if a JSON field has a wrong named line', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
        pippo: 'pluto',
        wrong: {},
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  try {
    const parser = new Parser(network);
    parser.checkNamedNodes(network, 'states');
  } catch (e) {
    expect(e.message).toBe('[Error_code] - Incorrect number of lines in states definition');
  }
});


/* test checkNamedNodes
 * Data una rete NON ben formata viene controllato che il metodo riconosca che una certa riga di un campo ha nomenclatura sbagliata.
 * Must return message error: .
*/

test('Test check if a JSON field has a wrong named line', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
        wrong: {},
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  try {
    const parser = new Parser(network);
    parser.checkNamedNodes(network, 'states');
  } catch (e) {
    expect(e.message).toBe('[Error_code] - Incorrect number of lines in states definition');
  }
});

//TEST UTILE?? checkDuplicatesMethod non dovrebbe essere un metodo del parser
/* test checkDuplicatesMethod
 * Viene controllato che un array esterno alla rete non abbia elementi ripetuti.
 * Must return True.
*/

test('Test check an array has duplicates', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  const el = [1, 2, 3, 4, 5, 1];
  const parser = new Parser(network);
  expect(parser.checkDuplicates(el)).toBe(true);
});


//TEST UTILE?? checkDuplicatesMethod non dovrebbe essere un metodo del parser
/* test checkDuplicatesMethod
 * Viene controllato che un array esterno alla rete non abbia elementi ripetuti.
 * Must return False.
*/

test('Test check an array hasn\'t duplicates', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  const el = [1, 2, 3, 4, 5];
  const parser = new Parser(network);
  expect(parser.checkDuplicates(el)).toBe(false);
});


/* test countNumberOfValue method
 * Viene controllato venga fornito il corretto numero di possibili probabilità combinate per un dato nodo.
 * Must return 4.
*/

test('Test count number of probabilities depending on parents states number', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  const parser = new Parser(network);
  expect(parser.countNumberOfValue('TBC o Cancro')).toBe(4);
});


/* test checkStates method
 * Data una rete ben formata viene controllato che abbia una corretta definizione degli stati dei nodi.
 * Must return TRUE.
*/

test('Test check if states are correctly defined', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  const parser = new Parser(network);
  expect(parser.checkStates()).toBe(true);
});


/* test checkStates method
 * Data una rete NON ben formata viene controllato che il metodo riconosca che un dato nodo possiede meno di 2 stati.
 * Must return error message: '[Error_code] - Error in nodes Fuma states definition, required at least 2.'.
*/

test('Test check if a node has less than 2 states', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  network.states.Fuma = [];
  try {
    const parser = new Parser(network);
    parser.checkStates();
  } catch (e) {
    expect(e.message).toBe('[Error_code] - Error in nodes Fuma states definition, required at least 2.');
  }
});


/* test checkStates method
 * Data una rete NON ben formata viene controllato che il metodo riconosca un tentativo di ridefinizione del medesimo stato di un nodo.
 * Must return error message: '[Error_code] - Error in node\'s Fuma states, trying to define multiple times same state.'.
*/

test('Test check if a node has repeated states', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  network.states.Fuma = ['true', 'true'];
  try {
    const parser = new Parser(network);
    parser.checkStates();
  } catch (e) {
    expect(e.message).toBe('[Error_code] - Error in node\'s Fuma states, trying to define multiple times same state.');
  }
});


/* test checkParents method
 * Data una rete ben formata viene controllato che i parents di ogni nodo siano ben definiti.
 * Must return True.
*/

test('Test check if parents are correctly defined', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  const parser = new Parser(network);
  expect(parser.checkParents()).toBe(true);
});


/* test checkParents method
 * Data una rete NON ben formata viene verificato che il metodo riconosca un tentativo di ridefinizione del medesimo stato di un nodo.
 * Must return error message: '[Error_code] - Trying to define multiple times same parent in Fuma'.
*/

test('Test check if a node has a repeated parent', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  network.parents.Fuma = ['Cancro', 'Cancro'];
  try {
    const parser = new Parser(network);
    parser.checkParents();
  } catch (e) {
    expect(e.message).toBe('[Error_code] - Trying to define multiple times same parent in Fuma');
  }
});


/* test checkParents method
 * Data una rete NON ben formata viene verificato che il metodo riconosca il fatto che sia indicato un nodo non esistente come padre.
 * Must return error message: '[Error_code] - Parent: unexisting  does not exits as node in Fuma.'.
*/

test('Test check if defining a not existing node as parent', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  network.parents.Fuma = ['unexisting'];
  try {
    const parser = new Parser(network);
    parser.checkParents();
  } catch (e) {
    expect(e.message).toBe('[Error_code] - Parent: unexisting  does not exits as node in Fuma.');
  }
});


/* test checkParents method
 * Data una rete NON ben formata viene verificato che il metodo riconosca il fatto che sia indicato come parente di un dato nodo se stesso.
 * Must return error message: '[Error_code] - Try to define Fuma as parent of itself.'.
*/

test('Test check if defining node as parent of itself', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  network.parents.Fuma = ['Fuma'];
  const parser = new Parser(network);
  try {
    parser.checkParents();
  } catch (e) {
    expect(e.message).toBe('[Error_code] - Try to define Fuma as parent of itself.');
  }
});


/* test checkProbabilities method
 * Data una rete ben formata viene verificato che le probabilità siano ben definite.
 * Must return True.
*/

test('Test check if probabilities are correctly defined', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  const parser = new Parser(network);
  expect(parser.checkProbabilities()).toBe(true);
});


/* test checkProbabilities method
 * Data una rete NON ben formata viene verificato che il metodo riconosca che per un nodo viene definito un numero di probabilità combinate errato.
 * Must return error : '[Error_code] - Try to define incorrect number of subsets in TBC o Cancro probabilities definition, expected 4, given 5'.
*/

test('Test check if a node\'s probabilities definition has wrong number of subsets', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[0.01, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  network.probabilities['TBC o Cancro'].push([1.0, 0.0]);
  const parser = new Parser(network);
  try {
    parser.checkProbabilities();
  } catch (e) {
    expect(e.message).toBe('[Error_code] - Try to define incorrect number of subsets in TBC o Cancro probabilities definition, expected 4, given 5');
  }
});


/* test checkProbabilities method
 * Data una rete NON ben formata viene verificato che il metodo riconosca che per un nodo viene definita una probabilità negativa.
 * Must return error : '[Error_code] - Invalid probability in -1,0.99: -1'.
*/

test('Test check if defining a < 0 probability', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[-1, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  const parser = new Parser(network);
  try {
    parser.checkProbabilities();
  } catch (e) {
    expect(e.message).toBe('[Error_code] - Invalid probability in -1,0.99: -1');
  }
});


/* test checkProbabilities method
 * Data una rete NON ben formata viene verificato che il metodo riconosca che per un nodo viene definita una probabilità maggiore a 100%.
 * Must return error : '[Error_code] - Invalid probability in 2,0.99: 2'.
*/

test('Test check if defining a > 1 probability', () => {
  const network = {
    name: 'test',
    nodes: ['Viaggio in Asia', 'Tubercolosi', 'Fuma', 'Cancro', 'Bronchite', 'TBC o Cancro', 'Dispnea', 'Risultati sui raggi X'],
    states:
      {
        'Viaggio in Asia': ['true', 'false'],
        Tubercolosi: ['true', 'false'],
        Fuma: ['true', 'false'],
        Cancro: ['true', 'false'],
        Bronchite: ['true', 'false'],
        'TBC o Cancro': ['true', 'false'],
        Dispnea: ['true', 'false'],
        'Risultati sui raggi X': ['true', 'false'],
      },
    parents:
      {
        'Viaggio in Asia': [],
        Tubercolosi: ['Viaggio in Asia'],
        Fuma: [],
        Cancro: ['Fuma'],
        Bronchite: ['Fuma'],
        'TBC o Cancro': ['Tubercolosi', 'Cancro'],
        Dispnea: ['TBC o Cancro', 'Bronchite'],
        'Risultati sui raggi X': ['TBC o Cancro'],
      },
    probabilities: {
      'Viaggio in Asia': [[2, 0.99]],
      Tubercolosi: [[0.05, 0.95], [0.01, 0.99]],
      Fuma: [[0.5, 0.5]],
      Cancro: [[0.1, 0.9], [0.01, 0.99]],
      Bronchite: [[0.6, 0.4], [0.3, 0.7]],
      'TBC o Cancro': [[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
      Dispnea: [[0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.1, 0.9]],
      'Risultati sui raggi X': [[0.98, 0.02], [0.05, 0.95]],
    },
  };
  const parser = new Parser(network);
  try {
    parser.checkProbabilities();
  } catch (e) {
    expect(e.message).toBe('[Error_code] - Invalid probability in 2,0.99: 2');
  }
});
