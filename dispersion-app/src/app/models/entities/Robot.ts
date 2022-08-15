export enum RobotState {
  START = 'START',
  EXPLORE = 'EXPLORE',
  LEADER = 'LEADER',
  SETTLED = 'SETTLED',
  TERMINATED = 'TERMINATED'
}

export class Robot {

  id: number;
  onID: number;
  state: RobotState;
  color: string;
  lastEdgeID: number;

  constructor(id?: number, onID?: number, state?: RobotState, color?: string, lastEdgeID?: number) {
    this.id = id;
    this.onID = onID;
    this.state = state;
    this.color = color;
    this.lastEdgeID = lastEdgeID;
  }

}
