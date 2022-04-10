import {NodeState} from "./Node";

export class MapNode {

  id: number;
  X: number;
  Y: number;

  constructor(id?: number, X?: number, Y?: number) {
    this.id = id;
    this.X = X;
    this.Y = Y;
  }

  init(object: any){
    this.id = object.id;
    this.X = object.X;
    this.Y = object.Y;
    return this;
  }

}
