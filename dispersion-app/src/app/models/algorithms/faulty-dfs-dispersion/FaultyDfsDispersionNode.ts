import { Node } from '../../core/Node';
import { NodeState } from '../../utils/NodeState';

export class FaultyDfsDispersionNode extends Node {
  constructor(id: number, state: NodeState) {
    super(id, state);
  }
}
