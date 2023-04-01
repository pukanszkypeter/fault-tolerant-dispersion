import { NodeState } from "./NodeState";

export interface Node {
  id: number;
  state: NodeState;

  // Meta
  rotorRouter?: number;
}
