function toGraph(obj) {
  const { nodes } = obj;
  const { parents } = obj;

  const arrNodes = [];
  for (const name in parents) {
    const node = nodes[name];
    const pas = parents[name];
    for (let i = 0; i < pas.length; i++) {
      const pa = nodes[pas[i]];
      node.parents.push(pa);
    }
    arrNodes.push(node);

    node.initSampleLw = function () {
      this.sampledLw = undefined;
    };
    node.sampleLw = function () {
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
    };
    node.saveSampleLw = function (f) {
      if (!this.sampledLw) {
        this.sampledLw = new Array(this.values.length);
        for (let h = this.values.length - 1; h >= 0; h--) {
          this.sampledLw[h] = 0;
        }
      }
      this.sampledLw[this.value] += f;
    };
  }

  const g = {
    nodes: arrNodes,
    sample(samples) {
      const g = this;
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
      }

      return lwSum;
    },
  };

  return g;
}

function sample(msg) {
  const obj = JSON.parse(msg);
  const { samples } = obj;
  const g = toGraph(obj);
  g.sample(samples);

  const nodes = {};
  for (let i = 0; i < g.nodes.length; i++) {
    const node = g.nodes[i];
    nodes[node.name] = node;
  }

  const response = {
    success: true,
    nodes,
  };
  self.postMessage(JSON.stringify(response));
}

self.onmessage = function (e) {
  sample(e.data);
};
