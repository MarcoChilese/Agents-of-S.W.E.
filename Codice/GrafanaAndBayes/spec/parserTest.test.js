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

describe('parser tests', () => {
  let network;
  beforeEach(() => {
    network = {
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
  });

// correct definition of network
  test('Test correct definition of a Network', () => {
    const parser = new Parser(network);
    expect(parser.validateNet()).toBe(true);
  });


  // test checkMinimumFields method
  test('Test check if JSON file has exactly 5 fields', () => {
    const parser = new Parser(network);
    expect(parser.checkMinimumFields()).toBe(true);
  });

  test('Test check if JSON file has more or less than 5 fields', () => {
    network.plus = {};
    const parser = new Parser(network);
    expect(() => { parser.checkMinimumFields(); }).toThrow(' Must be defined 5 fields in the network');
  });

  test('Test check if JSON file has a wrong named field', () => {
    delete network.states;
    network.wrong = {};
    try {
      const parser = new Parser(network);
      parser.checkMinimumFields();
    } catch (e) {
      expect(e.message)
        .toBe(' Incorrect states definition');
    }
  });

  // test checkNamedNodes
  test('Test check if a JSON field has wrong number of lines', () => {
    delete network.states.Fuma;
    network.states.pippo = 'pluto';
    try {
      const parser = new Parser(network);
      parser.checkNamedNodes(network, 'states');
    } catch (e) {
      expect(e.message)
        .toBe(' Incorrect number of lines in states definition');
    }
  });

  test('Test check if a JSON field has  wrong names in lines', () => {
    delete network.states.Bronchite;
    network.states.Bronca = 'nope';
    try {
      const parser = new Parser(network);
      parser.checkNamedNodes(network.states, 'states');
    } catch (e) {
      expect(e.message)
        .toBe(' Missing node Bronchite in states\' definition.');
    }
  });

  test('Test check if a JSON field has a wrong named line', () => {
    network.states.wrong = 'plus';
    try {
      const parser = new Parser(network);
      parser.checkNamedNodes(network, 'states');
    } catch (e) {
      expect(e.message).toBe(' Incorrect number of lines in states definition');
    }
  });

  // test checkDuplicatesMethod
  test('Test check an array has duplicates', () => {
    const el = [1, 2, 3, 4, 5, 1];
    const parser = new Parser(network);
    expect(parser.checkDuplicates(el))
      .toBe(true);
  });

  test('Test check an array hasn\'t duplicates', () => {
    const el = [1, 2, 3, 4, 5];
    const parser = new Parser(network);
    expect(parser.checkDuplicates(el))
      .toBe(false);
  });


  // test countNumberOfValue method
  test('Test count number of probabilities depending on parents states number', () => {
    const parser = new Parser(network);
    expect(parser.countNumberOfValue('TBC o Cancro'))
      .toBe(4);
  });


  // test checkStates method
  test('Test check if states are correctly defined', () => {
    const parser = new Parser(network);
    expect(parser.checkStates())
      .toBe(true);
  });

  test('Test check if a node has less than 2 states', () => {
    network.states.Fuma = [];
    try {
      const parser = new Parser(network);
      parser.checkStates();
    } catch (e) {
      expect(e.message)
        .toBe(' node Fuma requires at least 2 states.');
    }
  });

  test('Test check if a node has repeated states', () => {
    network.states.Fuma = ['true', 'true'];
    try {
      const parser = new Parser(network);
      parser.checkStates();
    } catch (e) {
      expect(e.message)
        .toBe(' trying to define multiple times same state in node Fuma.');
    }
  });


  // test checkParents method
  test('Test check if parents are correctly defined', () => {
    const parser = new Parser(network);
    expect(parser.checkParents())
      .toBe(true);
  });

  test('Test check if a node has a repeated parent', () => {
    network.parents.Fuma = ['Cancro', 'Cancro'];
    try {
      const parser = new Parser(network);
      parser.checkParents();
    } catch (e) {
      expect(e.message)
        .toBe(' trying to define multiple times same parent in Fuma');
    }
  });

  test('Test check if defining a not existing node as parent', () => {
    network.parents.Fuma = ['unexisting'];
    try {
      const parser = new Parser(network);
      parser.checkParents();
    } catch (e) {
      expect(e.message)
        .toBe(' parent unexisting does not exist as node in Fuma parents.');
    }
  });

  test('Test check if defining node as parent of itself', () => {
    network.parents.Fuma = ['Fuma'];
    const parser = new Parser(network);
    try {
      parser.checkParents();
    } catch (e) {
      expect(e.message)
        .toBe(' trying to define Fuma as parent of itself.');
    }
  });

  // test checkProbabilities method
  test('Test check if probabilities are correctly defined', () => {
    const parser = new Parser(network);
    expect(parser.checkProbabilities())
      .toBe(true);
  });

  test('Test check if a node\'s probabilities definition has wrong number of subsets', () => {
    network.probabilities['TBC o Cancro'].push([1.0, 0.0]);
    const parser = new Parser(network);
    try {
      parser.checkProbabilities();
    } catch (e) {
      expect(e.message)
        .toBe(' trying to define incorrect number of subsets in TBC o Cancro probabilities definition, expected 4, given 5');
    }
  });

  test('Test check if defining a < 0 probability', () => {
    network.probabilities.Fuma = [[-1, 0.5]];
    const parser = new Parser(network);
    try {
      parser.checkProbabilities();
    } catch (e) {
      expect(e.message)
        .toBe(' invalid probability in -1,0.5: -1');
    }
  });

  test('Test check if defining a > 1 probability', () => {
    network.probabilities.Fuma = [[2, 0.5]];
    const parser = new Parser(network);
    try {
      parser.checkProbabilities();
    } catch (e) {
      expect(e.message)
        .toBe(' invalid probability in 2,0.5: 2');
    }
  });

  test('Test check if defining a wrong number of probabilities in subset', () => {
    network.probabilities.Fuma = [[0.1, 0.5, 0.5]];
    const parser = new Parser(network);
    try {
      parser.checkProbabilities();
    } catch (e) {
      expect(e.message)
        .toBe(' invalid number of probabilities in subset number 0, expected 2, given 3');
    }
  });
});
