import { Node } from '../../core/Node';
import { NodeState } from '../../utils/NodeState';

export class RotorRouterWithLeaderDispersionNode extends Node {
  rotorRouter: number;

  constructor(id: number, state: NodeState, rotorRouter: number) {
    super(id, state);
    this.rotorRouter = rotorRouter;
  }
}
