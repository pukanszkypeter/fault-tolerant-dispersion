import { Robot } from '../../core/Robot';
import { Color } from '../../utils/Color';
import { RobotState } from '../../utils/RobotState';

export class RotorRouterDispersionRobot extends Robot {
  color: Color;
  onID: number;
  destinationID: number;

  constructor(
    id: number,
    state: RobotState,
    color: Color,
    onID: number,
    destinationID: number
  ) {
    super(id, state);
    this.color = color;
    this.onID = onID;
    this.destinationID = destinationID;
  }
}
