import { Robot } from '../../core/Robot';
import { RobotState } from '../../utils/RobotState';

export class RotorRouterWithLeaderDispersionRobot extends Robot {
  onID: number;
  destinationID: number;
  lastUsedEdgeID: number;

  constructor(
    id: number,
    state: RobotState,
    onID: number,
    destinationID: number,
    lastUsedEdgeID: number
  ) {
    super(id, state);
    this.onID = onID;
    this.destinationID = destinationID;
    this.lastUsedEdgeID = lastUsedEdgeID;
  }
}
