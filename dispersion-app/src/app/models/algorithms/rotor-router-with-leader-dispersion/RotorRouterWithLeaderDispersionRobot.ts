import { Robot } from '../../core/Robot';
import { Color } from '../../utils/Color';
import { RobotState } from '../../utils/RobotState';

export class RotorRouterWithLeaderDispersionRobot extends Robot {
  color: Color;
  onID: number;
  destinationID: number;
  lastUsedEdgeID: number;

  constructor(
    id: number,
    state: RobotState,
    color: Color,
    onID: number,
    destinationID: number,
    lastUsedEdgeID: number
  ) {
    super(id, state);
    this.color = color;
    this.onID = onID;
    this.destinationID = destinationID;
    this.lastUsedEdgeID = lastUsedEdgeID;
  }
}
