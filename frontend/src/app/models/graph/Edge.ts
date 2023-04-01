export interface Edge {
  id: number;
  fromId: number;
  toId: number;

  // Meta
  fromPort?: number;
  toPort?: number;
}
