import { Robot } from "../algorithm/Robot";
import { Graph } from "../graph/Graph";
import { SimulationState } from "../simulation/SimulationState";

export interface SimulationFault {
  step: number;
  state: SimulationState;
  graph: Graph;
  robots: Robot[];

  // Fault
  faults: number;
  probability: number;
}
