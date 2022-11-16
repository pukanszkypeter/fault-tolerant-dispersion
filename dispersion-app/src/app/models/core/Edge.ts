export class Edge {
  id: number;
  fromID: number;
  toID: number;

  constructor(id: number, fromID: number, toID: number) {
    this.id = id;
    this.fromID = fromID;
    this.toID = toID;
  }
}
