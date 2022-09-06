import {Robot, RobotState} from "../base-entities/Robot";

export class RotorRouterDispersionRobot extends Robot{

  lastEdgeID: number;

  constructor(id?: number, onID?: number, state?: RobotState, color?: string, destinationID?: number , lastEdgeID?: number) {
    super(id, onID, state, color, destinationID)
    this.lastEdgeID = lastEdgeID;
  }

}
