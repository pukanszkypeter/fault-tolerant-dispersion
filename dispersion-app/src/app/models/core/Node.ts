import { NodeState } from '../utils/NodeState';

export class Node {
  id: number;
  state: NodeState;

  constructor(id: number, state: NodeState) {
    this.id = id;
    this.state = state;
  }
}
