export class VisEdge {
  id: number;
  from: number;
  to: number;
  color: string;

  constructor(id: number, from: number, to: number, color: string) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.color = color;
  }
}
