import { RobotState } from "../utils/RobotState";

export class Robot {
  id: number;
  state: RobotState;

  constructor(id: number, state: RobotState) {
    this.id = id;
    this.state = state;
  }
}
