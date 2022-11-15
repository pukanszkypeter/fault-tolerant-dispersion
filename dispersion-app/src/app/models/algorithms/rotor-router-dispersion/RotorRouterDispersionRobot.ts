import { Robot } from '../../core/Robot';
import { RobotState } from '../../utils/RobotState';

export class RotorRouterDispersionRobot extends Robot {
  onID: number;
  destinationID: number;

  constructor(
    id: number,
    state: RobotState,
    onID: number,
    destinationID: number
  ) {
    super(id, state);
    this.onID = onID;
    this.destinationID = destinationID;
  }
}
