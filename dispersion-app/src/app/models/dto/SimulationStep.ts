import { Edge } from "../core/Edge";
import { Graph } from "../core/Graph";
import { Node } from "../core/Node";
import { Robot } from "../core/Robot";
import { AlgorithmType } from "../utils/AlgorithmType";
import { SimulationState } from "../utils/SimulationState";

export class SimulationStep<NodeType extends Node, EdgeType extends Edge, RobotType extends Robot> {

    algorithmType: AlgorithmType;
    simulationState: SimulationState;
    step: number;
    graph: Graph<NodeType, EdgeType>;
    robotList: RobotType[];

    constructor(algorithmType?: AlgorithmType, simulationState?: SimulationState, step?: number, graph?: Graph<NodeType, EdgeType>, robotList?: RobotType[]) {
        this.algorithmType = algorithmType;
        this.simulationState = simulationState;
        this.step = step;
        this.graph = graph;
        this.robotList = robotList;
    }

}