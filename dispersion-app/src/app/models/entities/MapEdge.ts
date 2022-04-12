
export class MapEdge {

  id: number;
  fromID: number;
  toID: number;

  constructor(id?: number, fromID?: number, toID?: number) {
    this.id = id;
    this.fromID = fromID;
    this.toID = toID;
  }

  init(object: any){
    this.id = object.id;
    this.fromID = object.fromID;
    this.toID = object.toID;
    return this;
  }

}
