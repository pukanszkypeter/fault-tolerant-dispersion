export enum NodeState {
  DEFAULT = '#ffffff',
  PENDING = '#ff0000',
  OCCUPIED = '#33cc33'
}

export class Node {

  id: number;
  state: NodeState;

  constructor(id?: number, state?: NodeState) {
    this.id = id;
    this.state = state;
  }

}

export class VisNode {

  id: number;
  label: string;
  color: string;

  constructor(id?: number, label?: string, color?: string) {
    this.id = id;
    this.label = label;
    this.color = color;
  }

}
