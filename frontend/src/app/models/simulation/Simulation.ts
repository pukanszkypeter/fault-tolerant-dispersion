import { Robot } from "../algorithm/Robot";
import { Graph } from "../graph/Graph";
import { SimulationState } from "./SimulationState";

export interface Simulation {
  step: number;
  state: SimulationState;
  graph: Graph;
  robots: Robot[];
}
