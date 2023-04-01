import { RobotState } from "./RobotState";

export interface Robot {
  id: number;
  onId: number;
  state: RobotState;

  // Meta
  parent?: number;
  child?: number;
  lastUsedPort?: number;
  destinationId?: number;
}
