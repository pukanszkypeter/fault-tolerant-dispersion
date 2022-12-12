import { Robot } from '../../core/Robot';
import { RobotPhase } from '../../utils/RobotPhase';
import { RobotState } from '../../utils/RobotState';

export class FaultyDfsDispersionRobot extends Robot {
  onID: number;
  parent: number;
  child: number;
  lastUsedPort: number;
  phase: RobotPhase;
  treeLabel: number;
  emptyBefore: boolean;

  constructor(
    id: number,
    state: RobotState,
    onID: number,
    parent: number,
    child: number,
    lastUsedPort: number,
    phase: RobotPhase,
    treeLabel: number,
    emptyBefore: boolean
  ) {
    super(id, state);
    this.onID = onID;
    this.parent = parent;
    this.child = child;
    this.lastUsedPort = lastUsedPort;
    this.phase = phase;
    this.treeLabel = treeLabel;
    this.emptyBefore = emptyBefore;
  }
}
