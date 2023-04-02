import { AlgorithmType } from "../algorithm/AlgorithmType";
import { Robot } from "../algorithm/Robot";
import { Graph } from "../graph/Graph";
import { GraphType } from "../graph/GraphType";

export interface SimulationBatch {
  graphType: GraphType;
  graph: Graph;
  algorithmType: AlgorithmType;
  teams: number;
  robots: Robot[];
  numOfTests: number;
}
