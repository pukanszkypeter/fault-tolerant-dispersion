export enum RobotState {
  SEARCHING = 'SEARCHING',
  LEADER = 'LEADER',
  FINISHED = 'FINISHED',
  SETLER = 'SETLER'
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
