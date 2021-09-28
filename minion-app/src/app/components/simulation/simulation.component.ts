import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GraphState, NodeState, RobotState } from 'src/app/models/GraphState';
import * as vis from 'vis-network';
import {GraphGeneratorService} from "../../services/graphs/graph-generator.service";
import {AlgorithmEngineService} from "../../services/algorithms/algorithm-engine.service";

interface Graph {
  value: string;
  viewValue: string;
}

interface Algorithm {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {

  @ViewChild('graphNetwork') set setGraphContainer(graphContainer: ElementRef) { this.graphContainer = graphContainer; }
  graphContainer: ElementRef;

  public tree: any;

  graphState: GraphState;

  GRAPH_INIT = false;

  graphs: Graph[] = [
    { value: 'complete', viewValue: 'Complete'},
    { value: 'simpleLine', viewValue: 'Simple line'},
    { value: 'circle', viewValue: 'Circle'},
    { value: 'barbell', viewValue: 'Barbell'},
    { value: 'lollipop', viewValue: 'Lollipop'},
    { value: 'specialLine', viewValue: 'Special line'},
    { value: 'grid', viewValue: 'Grid'},
    { value: 'hypercube', viewValue: 'Hypercube'},
    { value: 'er_random', viewValue: 'ER random'},
  ];

  algorithms: Algorithm[] = [
    { value: 'random_with_color_constraints', viewValue: 'Random with color constraints'}
  ];

  simulationSettings: FormGroup;
  graph = new FormControl('', Validators.required);
  algorithm = new FormControl('', Validators.required);
  nodes = new FormControl(1, [Validators.min(1), Validators.required]);
  robots = new FormControl(1, [Validators.min(1), Validators.required]);
  colors = new FormControl(1, [Validators.min(1), Validators.required]);
  start = new FormControl('', [Validators.required]);

  constructor(private graphGenerator: GraphGeneratorService, private algorithmEngine: AlgorithmEngineService, fb: FormBuilder) {
    this.simulationSettings = fb.group({
      graph: this.graph,
      algorithm: this.algorithm,
      nodes: this.nodes,
      robots: this.robots,
      colors: this.colors,
      start: this.start
    });
   }

  ngOnInit(): void {
  }

  createGraph(): void {
    let colors = [];
    for (let i = 0; i < Number(this.colors.value); i++) {
      colors.push(this.getRandomColor());
    }

    const result = this.graphGenerator.generateGraph(this.graph.value, this.nodes.value, this.robots.value, this.start.value);
    console.log(result);
    let splitResult = result.split('\n');
    splitResult.pop();

    let nodes = [];
    let edges = [];
    let robots = [];

    for (let i = 0; i < splitResult.length; i++) {
      const splitLine = splitResult[i].split(':');
      const from  = splitLine[0];
      nodes.push({ id: Number(from), label: from });

      const toValues = splitLine[1].split(',');
      for (let j = 0; j < toValues.length; j++) {
        const duplicate = edges.find(edge => edge.from === Number(toValues[j]) && edge.to === Number(from))
        if (!duplicate) {
          edges.push({ from: Number(from), to: Number(toValues[j]), color: colors[this.randomIntFromInterval(0, colors.length - 1)]});
        } 
      }

      if (splitLine.length === 3) {
        const robotsOnNode = splitLine[2].split(',');
        for (let robot of robotsOnNode) {
          robots.push({ id: Number(robot), on: Number(from), state: RobotState.SEARCHING, color: colors[this.randomIntFromInterval(0, colors.length - 1)]});
        }
      }
    }

    this.graphState = new GraphState(nodes, edges, robots);

    const container = this.graphContainer.nativeElement;
    let data = {
      nodes: nodes,
      edges: edges,
    };
    let options = {};
    this.tree = new vis.Network(container, data, options);

    this.tree.on('click', (event: any) => {
      console.log(event);
    });
  }

  initGraph(): void {
    const robots = this.graphState.robots;
    let pending_nodes: number[] = [];

    for (let robot of robots) {
      if (!pending_nodes.includes(robot.on)) {
        pending_nodes.push(robot.on)
      }
    }

    this.graphState.nodes.forEach(node => {
      if (pending_nodes.includes(node.id)) {
        node.state = NodeState.PENDING;
      }
    });

    this.GRAPH_INIT = true;
    this.redrawGraphAfterGraphState(this.graphState);
  }

  redrawGraphAfterGraphState(graphState: GraphState): void {
    let nodes = [];
    let edges = graphState.edges;

    for (let node of graphState.nodes) {
      nodes.push({ id: node.id, label: node.label, color: node.state});
    }

    const container = this.graphContainer.nativeElement;
    let data = {
      nodes: nodes,
      edges: edges,
    };
    let options = {};
    this.tree = new vis.Network(container, data, options);
    console.log(this.graphState);
  }

  nextStep(): void {
    this.graphState = this.algorithmEngine.nextState(this.graphState, this.algorithm.value);
    if (this.graphState) {
      this.redrawGraphAfterGraphState(this.graphState);
    } else {
      alert('Finished!');
      this.GRAPH_INIT = false;
    }
  }

  getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

}
