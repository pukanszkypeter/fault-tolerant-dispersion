import { RobotState } from "./RobotState";

export interface Robot {
  id: number;
  onId: number;
  state: RobotState;
}
