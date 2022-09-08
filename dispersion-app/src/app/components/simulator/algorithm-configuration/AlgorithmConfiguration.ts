import {Robot} from "../../../models/base-entities/Robot";

export class AlgorithmConfiguration {

  algorithmType: string;
  robots: Robot[];

  constructor(algorithmType?: string, robots?: Robot[]) {
    this.algorithmType = algorithmType;
    this.robots = robots;
  }

  initialize(object: any): AlgorithmConfiguration {
    this.algorithmType = object.algorithmType;
    this.robots = object.robots;

    return this;
  }

}
