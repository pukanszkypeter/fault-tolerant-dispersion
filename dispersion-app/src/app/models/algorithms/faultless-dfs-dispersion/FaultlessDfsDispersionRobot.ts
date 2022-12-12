import { Robot } from '../../core/Robot';
import { RobotState } from '../../utils/RobotState';

export class FaultlessDfsDispersionRobot extends Robot {
  onID: number;
  parent: number;
  child: number;
  lastUsedPort: number;

  constructor(
    id: number,
    state: RobotState,
    onID: number,
    parent: number,
    child: number,
    lastUsedPort: number
  ) {
    super(id, state);
    this.onID = onID;
    this.parent = parent;
    this.child = child;
    this.lastUsedPort = lastUsedPort;
  }
}
