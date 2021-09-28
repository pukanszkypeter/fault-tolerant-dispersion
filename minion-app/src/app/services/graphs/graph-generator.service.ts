import { Injectable } from '@angular/core';
import {DisjointSet} from "../../models/DisjointSet";
import {SimpleGraph} from "../../models/SimpleGraph";

@Injectable({
  providedIn: 'root'
})
export class GraphGeneratorService {

  constructor() { }

  converter(graph: SimpleGraph, numberOfRobots: number, startNodes: string): string {
    let startNodeCounter = 0;

    let result = '';
    for (let i = 0; i < graph.getNumberOfNodes(); ++i) {
      result += i + ':';
      let firstInLine = true;
      for (let j = 0; j < graph.getNumberOfNodes(); ++j) {
        if (graph.hasEdge(i, j)) {
          if (firstInLine) {
            firstInLine = false;
          } else {
            result += ',';
          }
          result += j;
        }
      }

      if (startNodes.includes(i + '')) {
        result += ':';
        let first = true; // because of commas
        for (let j = 0; j < numberOfRobots; ++j) {
          if (j % startNodes.length == startNodeCounter) {
            if (first) {
              result += j;
              first = false;
            } else {
              result += ',' + j;
            }
          }
        }
        startNodeCounter++;
      }
      result += '\n';
    }

    return result;
  }

  generateCompleteGraph(size: number, robots: number, startNodes: string) {
    const graph = new SimpleGraph(size);

    for (let i = 0; i < size - 1; ++i) {
      for (let j = i + 1; j < size; ++j) {
        graph.addEdge(i, j);
      }
    }

    return this.converter(graph, robots, startNodes);
  }

  generateCircleGraph(size: number, robots: number, startNodes: string) {
    const graph = new SimpleGraph(size);

    for (let i = 0; i < size - 1; ++i) {
      graph.addEdge(i, i + 1);
    }
    graph.addEdge(0, size - 1);

    return this.converter(graph, robots, startNodes);
  }

  generateSimpleLine(size: number, robots: number, startNodes: string) {
    const graph = new SimpleGraph(size);
    for (let i = 0; i < size - 1; ++i) {
        graph.addEdge(i, i + 1);
    }

    return this.converter(graph, robots, startNodes);
  }

  generateBarbellGraph(numOfNodes: number, robots: number, startNodes: string) {
    if (numOfNodes % 3 != 0) {
      alert('Number of nodes must be multiple of 3!');
      return;
    }

    const graph = new SimpleGraph(numOfNodes);

    for (let i = 0; i < numOfNodes / 3 - 1; ++i) {
      for (let j = i + 1; j < numOfNodes / 3; ++j) {
        graph.addEdge(i, j);
        graph.addEdge(i + (2 * numOfNodes / 3), j + (2 * numOfNodes / 3));
      }
    }

    for (let i = (numOfNodes / 3 - 1); i < (2 * numOfNodes / 3); ++i) {
      graph.addEdge(i, i + 1);
    }

    return this.converter(graph, robots, startNodes);
  }

  generateLollipopGraph(numOfNodes: number, robots: number, startNodes: string) {
    if (numOfNodes % 2 != 0) {
      alert('Number of nodes must be multiple of 2!');
      return;
    }

    const graph = new SimpleGraph(numOfNodes);

    for (let i = 0; i < numOfNodes / 2 - 1; ++i) {
      for (let j = i + 1; j < numOfNodes / 2; ++j) {
        graph.addEdge(i, j);
      }
    }

    for (let i = (numOfNodes / 2 - 1); i < (numOfNodes - 1); ++i) {
      graph.addEdge(i, i + 1);
    }

    return this.converter(graph, robots, startNodes);
  }

  generateSpecialLine(numOfNodes: number, robots: number, startNodes: string) {
    const graph = new SimpleGraph(numOfNodes);

    for (let i = 0; i < numOfNodes; ++i) {
      if (i % 2 == 0) {
        if (i > 0) {
          graph.addEdge(i, i - 2);
        }
        if (i > 0 && i < numOfNodes - 1) {
          graph.addEdge(i, i + 2);
        }
      } else {
        graph.addEdge(i, i - 1);
      }
    }

    return this.converter(graph, robots, startNodes);
  }

  isInRange(node: number, numOfNodes: number) {
    return node >= 0 && node < numOfNodes;
  }

  isInLineRange(node: number, line: number, sqrRoot: number) {
    return node >= (line * sqrRoot) && node < ((line + 1) * sqrRoot);
  }

  generateGridGraph(numOfNodes: number, robots: number, startNodes: string) {
    const sqrRoot = Math.floor(Math.sqrt(numOfNodes));
    let line = 0;

    const graph = new SimpleGraph(numOfNodes);

    for (let i = 0; i < numOfNodes; ++i) {
      if (i > 0 && i % sqrRoot == 0) {
        line++;
      }
      if (this.isInLineRange(i - 1, line, sqrRoot)) {
        graph.addEdge(i, i - 1);
      }
      if (this.isInLineRange(i + 1, line, sqrRoot)) {
        graph.addEdge(i, i + 1);
      }
      if (this.isInRange(i + sqrRoot, numOfNodes)) {
        graph.addEdge(i, i + sqrRoot);
      }
      if (this.isInRange(i - sqrRoot, numOfNodes)) {
        graph.addEdge(i, i - sqrRoot);
      }
    }

    return this.converter(graph, robots, startNodes);
  }

  // Hypercube

  calculateSetBits(number: number) {
    let count = 0;
    while (number) {
      number = number & (number - 1);
      count++;
    }
    return count;
  }

  generateHyperCube(numOfNodes: number, robots: number, startNodes: string) {
    if (this.calculateSetBits(numOfNodes) != 1) {
      alert("Number of nodes must be power of 2!");
      return;
    }

    const graph = new SimpleGraph(numOfNodes);
    for (let i = 0; i < numOfNodes; ++i) {
      for (let j = 0; j < Math.log2(numOfNodes); ++j) {
        graph.addEdge(i, i ^ Math.pow(2, j));
      }
    }

    return this.converter(graph, robots, startNodes);
  }

  // Random graph

  generateERRandomGraph(numOfNodes: number, robots: number, startNodes: string) {
    let p = Math.log2(numOfNodes) / numOfNodes;
    let graph;

    let disjointSet = new DisjointSet(numOfNodes);
    while (disjointSet.numberOfComponents > 1) {
      graph = new SimpleGraph(numOfNodes);
      for (let i = 0; i < numOfNodes; ++i) {
        for (let j = 0; j < numOfNodes; ++j) {
          if (i != j && Math.random() <= p) {
            graph.addEdge(i, j);
            disjointSet.unionComponents(i, j);
          }
        }
      }
    }

    return this.converter(graph, robots, startNodes);
  }

  generateGraph(type: string, size: number, robots: number, startNodes: string): string {
    switch(type) {
      case 'simpleLine': return this.generateSimpleLine(size, robots, startNodes);
      case 'circle': return this.generateCircleGraph(size, robots, startNodes);
      case 'complete': return this.generateCompleteGraph(size, robots, startNodes);
      case 'barbell': return this.generateBarbellGraph(size, robots, startNodes);
      case 'lollipop': return this.generateLollipopGraph(size, robots, startNodes);
      case 'specialLine': return this.generateSpecialLine(size, robots, startNodes);
      case 'grid': return this.generateGridGraph(size, robots, startNodes);
      case 'hypercube': return this.generateHyperCube(size, robots, startNodes);
      case 'er_random': return this.generateERRandomGraph(size, robots, startNodes);
    }
  }

}
