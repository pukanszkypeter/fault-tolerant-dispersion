import { Edge } from '../../core/Edge';

export class FaultlessDfsDispersionEdge extends Edge {
  fromPort: number;
  toPort: number;

  constructor(
    id: number,
    fromID: number,
    toID: number,
    fromPort: number,
    toPort: number
  ) {
    super(id, fromID, toID);
    this.fromPort = fromPort;
    this.toPort = toPort;
  }
}
