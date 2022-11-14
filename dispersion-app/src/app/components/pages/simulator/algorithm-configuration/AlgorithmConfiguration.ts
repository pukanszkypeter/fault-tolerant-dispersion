import { AlgorithmType } from 'src/app/models/utils/AlgorithmType';

export class AlgorithmConfiguration {
  algorithmType: AlgorithmType;
  robots: any[];

  constructor(algorithmType?: AlgorithmType, robots?: any[]) {
    this.algorithmType = algorithmType;
    this.robots = robots;
  }

  initialize(object: any): AlgorithmConfiguration {
    this.algorithmType = object.algorithmType;
    this.robots = object.robots;

    return this;
  }
}
