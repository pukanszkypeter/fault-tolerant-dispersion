import { AlgorithmType } from "../algorithm/AlgorithmType";
import { GraphType } from "../graph/GraphType";

export interface SimulationResult {
  id: number | null;
  algorithmType: AlgorithmType | undefined;
  graphType: GraphType | undefined;
  steps: number;
  nodes: number;
  teams: number;
  robots: number;
  crashes: number;
  faults: number;
  probability: number;
}
