import { Node } from '../../core/Node';
import { Color } from '../../utils/Color';
import { NodeState } from '../../utils/NodeState';

export class RotorRouterDispersionNode extends Node {
  rotorRouter: Map<Color, number>;

  constructor(id: number, state: NodeState, rotorRouter: Map<Color, number>) {
    super(id, state);
    this.rotorRouter = rotorRouter;
  }
}
