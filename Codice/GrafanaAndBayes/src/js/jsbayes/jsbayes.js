(function (window) {
  /**
   * Initializes a conditional probability table.
   * @param {Number} numValues Number of values.
   * @returns {Array} Array of doubles that sum to 1.0.
   */
  function initCpt(numValues) {
    const cpt = [];
    let sum = 0;
    for (var i = 0; i < numValues; i++) {
      cpt[i] = Math.random();
      sum += cpt[i];
    }
    for (var i = 0; i < numValues; i++) {
      cpt[i] = cpt[i] / sum;
    }
    return cpt;
  }

  /**
   * Initializes a CPT with fake and normalized values using recursion.
   * @param {Array} values Values of variables (array of values).
   * @param {Array} parents Array of JSON nodes that are parents of the variable.
   * @param {Number} paIndex The current parent index.
   * @returns {Array} An array of nested arrays representing the CPT.
   */
  function initCptWithParents(values, parents, paIndex) {
    if (parents && parents.length > 0) {
      if (parents.length === 1 || paIndex === parents.length - 1) {
        const idx = parents.length === 1 ? 0 : paIndex;
        var numPaVals = parents[idx].values.length;
        var cpts = [];
        for (var i = 0; i < numPaVals; i++) {
          var cpt = initCpt(values.length);
          cpts.push(cpt);
        }
        return cpts;
      }
      var cpts = [];
      var numPaVals = parents[paIndex].values.length;
      for (var i = 0; i < numPaVals; i++) {
        var cpt = initCptWithParents(values, parents, paIndex + 1);
        cpts.push(cpt);
      }
      return cpts;
    }
    return initCpt(values.length);
  }

  /**
   * Creates a Promise.
   * @param {Object} f Function.
   * @param {Array} args List of arguments.
   * @returns {Promise} Promise.
   */
  function async(f, args) {
    return new Promise(
      ((resolve, reject) => {
        try {
          const r = f(...args);
          resolve(r);
        } catch (e) {
          reject(e);
        }
      }),
    );
  }

  /**
   * Checks if an object is an array.
   * @param {*} o Object.
   * @returns {Boolean} A boolean to indicate if the object is an array object.
   */
  function isArray(o) {
    return (o.constructor === Array);
  }

  /**
   * Checks if an object is an array of arrays.
   * @param {*} o Object.
   * @returns {Boolean} A boolean to indicate if the object is array of arrays.
   */
  function isArrayOfArray(o) {
    if (isArray(o)) {
      if (o.length > 0) {
        if (isArray(o[0])) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Sets the CPT entries to the specified probabilities.
   * @param {Array} cpt Array of nested arrays representing a CPT.
   * @param {Array} probs Array of arrays of probabilities representing a CPT.
   * @param {Number} index The current index.
   * @returns {Number} The next index.
   */
  function setNodeCptProbs(cpt, probs, index) {
    if (!isArrayOfArray(cpt)) {
      for (var i = 0; i < cpt.length; i++) {
        cpt[i] = probs[index][i];
      }
      const nextIndex = index + 1;
      return nextIndex;
    }
    let next = index;
    for (var i = 0; i < cpt.length; i++) {
      next = setNodeCptProbs(cpt[i], probs, next);
    }
    return next;
  }

  /**
   * Initializes a node's CPT.
   * @param {Array} values Array of values.
   * @param {Array} parents Array of parents.
   * @param {Array} probs Array of arrays of probabilities.
   * @returns {Array} Array of nested arrays representing a CPT.
   */
  function initNodeCpt(values, parents, probs) {
    const cpt = initCptWithParents(values, parents, 0);
    setNodeCptProbs(cpt, probs, 0);
    return cpt;
  }

  /**
   * Normalizes an array of values such that the elements sum to 1.0. Note that
   * 0.001 is added to every value to avoid 0.0 probabilities. This adjustment
   * helps with visualization downstream.
   * @param {Array} arr Array of probabilities.
   * @returns {Array} Normalized probailities.
   */
  function normalizeProbs(arr) {
    const probs = [];
    let sum = 0.0;
    for (var i = 0; i < arr.length; i++) {
      probs[i] = arr[i] + 0.001;
      sum += probs[i];
    }
    for (var i = 0; i < arr.length; i++) {
      probs[i] = probs[i] / sum;
    }
    return probs;
  }

  /**
   * Normalizes a CPT.
   * @param {Array} cpts Array of arrays (matrix) representing a CPT.
   * @returns {Array} Normalized CPT.
   */
  function normalizeCpts(cpts) {
    const probs = [];
    for (let i = 0; i < cpts.length; i++) {
      probs.push(normalizeProbs(cpts[i]));
    }
    return probs;
  }

  /**
   * Defines the library.
   */
  function defineLib() {
    const jsbayes = {};
    jsbayes.newGraph = function () {
      return {
        nodes: [],
        saveSamples: false,
        samples: [],
        reinit() {
          const f = function (g) {
            for (let i = 0; i < g.nodes.length; i++) {
              const node = g.nodes[i];
              if (node.dirty === undefined || node.dirty) {
                node.cpt = initCptWithParents(node.values, node.parents, 0);
                node.dirty = false;
              }
            }
          };
          return async(f, [this]);
        },
        samplesAsCsv(options) {
          const opts = options || {};
          const D_ROW = opts.rowDelimiter || '\n';
          const D_FIELD = opts.fieldDelimiter || ',';
          let csv = '';
          let row = '';
          for (var i = 0; i < this.nodes.length; i++) {
            row += this.nodes[i].name;
            if (i < this.nodes.length - 1) {
              row += D_FIELD;
            }
          }
          csv += row + D_ROW;

          for (var i = 0; i < this.samples.length; i++) {
            const sample = this.samples[i];
            row = '';
            for (let j = 0; j < this.nodes.length; j++) {
              const node = this.nodes[j];
              row += sample[node.name];
              if (j < this.nodes.length - 1) {
                row += D_FIELD;
              }
            }
            csv += row;
            if (i < this.samples.length - 1) {
              csv += D_ROW;
            }
          }

          return csv;
        },
        sample(samples) {
          const f = function (g, samples) {
            if (g.saveSamples) {
              // reset the samples if we want to save them
              g.samples = [];
            }

            for (var h = g.nodes.length - 1; h >= 0; h--) {
              g.nodes[h].initSampleLw();
            }

            let lwSum = 0;
            for (let count = 0; count < samples; count++) {
              for (var h = g.nodes.length - 1; h >= 0; h--) {
                var n = g.nodes[h];
                if (!n.isObserved) {
                  n.value = -1;
                }
                n.wasSampled = false;
              }

              let fa = 1;
              for (var h = g.nodes.length - 1; h >= 0; h--) {
                var n = g.nodes[h];
                fa *= n.sampleLw();
              }
              lwSum += fa;
              for (var h = g.nodes.length - 1; h >= 0; h--) {
                var n = g.nodes[h];
                n.saveSampleLw(fa);
              }

              if (g.saveSamples) {
                const sample = {};
                for (var h = g.nodes.length - 1; h >= 0; h--) {
                  var n = g.nodes[h];
                  sample[n.name] = n.values[n.value];
                }
                g.samples.push(sample);
              }
            }

            return lwSum;
          };
          return async(f, [this, samples]);
        },
        update(m) {
          for (let i = 0; i < this.nodes.length; i++) {
            const tnode = this.nodes[i]; // 'this' node
            const unode = m[tnode.name]; // update node

            if (!unode) {
              continue;
            }

            tnode.value = unode.value;
            tnode.wasSampled = unode.wasSampled;
            tnode.sampledLw = unode.sampledLw;
          }
        },
        node(name) {
          if (!this.nodeMap) {
            this.nodeMap = {};
            for (let i = 0; i < this.nodes.length; i++) {
              const node = this.nodes[i];
              this.nodeMap[node.name] = node;
            }
          }
          return this.nodeMap[name];
        },
        observe(name, value) {
          const node = this.node(name);
          if (node) {
            const index = node.valueIndex(value);
            if (index >= 0) {
              node.isObserved = true;
              node.value = index;
            } else {
              console.error(`could not find value ${value} for node ${name}`);
            }
          } else {
            console.error(`could not find node with name ${name}`);
          }
        },
        unobserve(name) {
          const node = this.node(name);
          if (node) {
            node.isObserved = false;
            node.value = -1;
          }
        },
        addNode(name, values) {
          const node = {
            name,
            values,
            value: -1,
            parents: [],
            wasSampled: false,
            sampledLw: undefined,
            addParent(parent) {
              this.parents.push(parent);
              this.dirty = true;
              return this;
            },
            valueIndex(v) {
              if (!this.valueIndexMap) {
                this.valueIndexMap = {};
                for (let i = 0; i < this.values.length; i++) {
                  const value = this.values[i];
                  this.valueIndexMap[value] = i;
                }
              }
              return this.valueIndexMap[v];
            },
            initSampleLw() {
              this.sampledLw = undefined;
            },
            sampleLw() {
              if (this.wasSampled) {
                return 1;
              }

              let fa = 1;
              for (var h = 0; h < this.parents.length; h++) {
                const pa = this.parents[h];
                const pSampleLw = pa.sampleLw();
                fa *= pSampleLw;
              }

              this.wasSampled = true;

              let dh = this.cpt;
              for (var h = 0; h < this.parents.length; h++) {
                const p = this.parents[h];
                var v = p.value;
                dh = dh[v];
              }

              if (this.value != -1) {
                var v = dh[this.value];
                fa *= v;
              } else {
                let fv = Math.random();
                for (var h = 0; h < dh.length; h++) {
                  var v = dh[h];
                  fv -= v;
                  if (fv < 0) {
                    this.value = h;
                    break;
                  }
                }
              }

              return fa;
            },
            saveSampleLw(f) {
              if (!this.sampledLw) {
                this.sampledLw = new Array(this.values.length);
                for (let h = this.values.length - 1; h >= 0; h--) {
                  this.sampledLw[h] = 0;
                }
              }
              this.sampledLw[this.value] += f;
            },
            setCpt(probs) {
              if (this.parents.length === 0) {
                this.cpt = normalizeProbs(probs);
              } else {
                this.cpt = initNodeCpt(this.values, this.parents, normalizeCpts(probs));
              }
            },
            probs() {
              if (!this.sampledLw) {
                return [];
              }
              let sum = 0.0;
              const probs = [];
              for (var i = 0; i < this.sampledLw.length; i++) {
                const s = this.sampledLw[i];
                sum += s;
                probs.push(s);
              }
              for (var i = 0; i < this.sampledLw.length; i++) {
                probs[i] = probs[i] / sum;
              }
              return probs;
            },
          };
          this.nodes.push(node);
          return node;
        },
      };
    };

    jsbayes.toMessage = function (g) {
      const nodes = {};
      const parents = {};

      for (let i = 0; i < g.nodes.length; i++) {
        const n = g.nodes[i];
        const node = {
          name: n.name,
          values: n.values,
          value: n.value,
          parents: [],
          wasSampled: n.wasSampled,
          sampledLw: n.sampledLw,
          cpt: n.cpt,
        };
        nodes[n.name] = node;

        const pas = [];
        for (let j = 0; j < n.parents.length; j++) {
          const pa = n.parents[j];
          pas.push(pa.name);
        }
        parents[n.name] = pas;
      }

      const msg = {
        samples: 10000,
        nodes,
        parents,
      };

      return JSON.stringify(msg);
    };

    return jsbayes;
  }

  if (typeof module === 'object' && module && typeof module.exports === 'object') {
    module.exports = defineLib();
  } else {
    if (typeof (jsbayes) === 'undefined') {
      window.jsbayes = defineLib();
    }

    if (typeof define === 'function' && define.amd) {
      define('jsbayes', [], defineLib());
    }
  }
}(this));
