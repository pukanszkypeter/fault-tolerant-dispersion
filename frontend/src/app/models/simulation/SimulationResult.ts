import { AlgorithmType } from "../algorithm/AlgorithmType";
import { GraphType } from "../graph/GraphType";

export interface SimulationResult {
  id: number | null;
  algorithmType: AlgorithmType | undefined;
  graphType: GraphType | undefined;
  nodes: number;
  robots: number;
  steps: number;
  robotsCrashed: number;
}
