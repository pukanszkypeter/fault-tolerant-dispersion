import { Node } from '../../core/Node';
import { NodeState } from '../../utils/NodeState';

export class FaultlessDfsDispersionNode extends Node {
  constructor(id: number, state: NodeState) {
    super(id, state);
  }
}
