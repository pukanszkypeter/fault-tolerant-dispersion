import { AlgorithmType } from "../algorithm/AlgorithmType";
import { Robot } from "../algorithm/Robot";
import { Graph } from "../graph/Graph";
import { GraphType } from "../graph/GraphType";

export interface SimulationFaultBatch {
  graphType: GraphType;
  graph: Graph;
  algorithmType: AlgorithmType;
  robots: Robot[];
  numOfTests: number;

  // Fault
  faults: number;
  probability: number;
}
