import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GraphState, NodeState, RobotState } from 'src/app/models/GraphState';
import * as vis from 'vis-network';
import {GraphGeneratorService} from "../../services/graphs/graph-generator.service";
import {AlgorithmEngineService} from "../../services/algorithms/algorithm-engine.service";
import { Network } from "vis-network/peer/esm/vis-network";
import { DataSet } from "vis-data/peer/esm/vis-data"
import {timer} from "rxjs";

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

  stop: boolean;

  delay: number = 1000;

  visDataNodes:any;
  visDataEdges: any;

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
    { value: 'random_with_color_constraints', viewValue: 'Random with color constraints'},
    { value: 'random_with_leader_with_color_constraints', viewValue: 'Leader with color constraints'}
  ];

  simulationSettings: FormGroup;
  graph = new FormControl('', Validators.required);
  algorithm = new FormControl('', Validators.required);
  nodes = new FormControl(1, [Validators.min(1), Validators.required]);
  robots = new FormControl(1, [Validators.min(1), Validators.required]);
  colors = new FormControl(1, [Validators.min(1), Validators.required]);
  start = new FormControl('', [Validators.required]);
  delayControl = new FormControl(1000 );

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
          edges.push({ from: Number(from), to: Number(toValues[j]), color: colors[this.randomIntFromInterval(0, colors.length - 1)], oldColor: ''});
        }
      }

      if (splitLine.length === 3) {
        const robotsOnNode = splitLine[2].split(',');
        for (let robot of robotsOnNode) {
          robots.push({ id: Number(robot), on: Number(from), state: RobotState.SEARCHING, color: colors[this.randomIntFromInterval(0, colors.length - 1)]});
        }
      }
    }

    console.log(edges);
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
    let edges:any[] = graphState.edges;

    for (let node of graphState.nodes) {
      nodes.push({ id: node.id, label: node.label, color: node.state});
    }

    const container = this.graphContainer.nativeElement;

    this.visDataNodes = new DataSet(nodes);
    this.visDataEdges = new DataSet(edges);

    let data = {
      nodes: this.visDataNodes,
      edges: this.visDataEdges,
    };

    let options = {};

    this.tree = new vis.Network(container, data, options);
    //console.log(this.graphState);
  }

  updateGraph(graphState: GraphState) {


    for (let node of graphState.nodes) {

      this.visDataNodes.update({ id: node.id, label: node.label, color: node.state});
    }

  }

  nextStep(): void {
    this.graphState = this.algorithmEngine.nextState(this.graphState, this.algorithm.value);
    if (this.graphState) {

      this.updateGraph(this.graphState);
    } else {
      alert('Finished!');
      this.stop = false;
      this.GRAPH_INIT = false;
    }
  }

  play(): void {

    this.stop = true;
    let interval = setInterval(() => {

        this.nextStep();

        if (!this.stop) {
          clearInterval(interval);
        }


      }, this.delay);

  }

  scrolling(){
    this.delay = this.delayControl.value;
    this.play();
  }





  stopPlaying() {
    this.stop = false;
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

  dinamicEdge(network: Network){
    network.on('click', (event: any) => {
      const item = this.visDataEdges.get(event.edges)[0];
      if (item.color !== 'white') {
        this.visDataEdges.update({from: item.from, to: item.to, color: 'white', id: item.id, oldColor: item.color})
      }else {
        this.visDataEdges.update({from: item.from, to: item.to, color: item.oldColor, id: item.id})
      }


    });
  }

}
