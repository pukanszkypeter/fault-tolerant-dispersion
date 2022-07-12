import {from} from "rxjs";

export class Edge {

  id: number;
  fromID: number;
  toID: number;
  color: string;

  constructor(id?: number, fromID?: number, toID?: number, color?: string) {
    this.id = id;
    this.fromID = fromID;
    this.toID = toID;
    this.color = color;
  }

}

export class VisEdge {

  id: number;
  from: number;
  to: number;
  color: string;

  constructor(id?: number, from?: number, to?: number, color?: string) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.color = color;
  }

}
