import {Node, NodeState} from "../base-entities/Node";
import {Color} from "../others/Colors";

export class RotorRouterWithLeaderNode extends Node{

  currentComponentPointer: Map<Color, number>;

  constructor(id?: number, state?: NodeState, currentComponentPointer?: Map<Color, number>) {
    super(id, state);
    this.currentComponentPointer = currentComponentPointer;
  }

}
