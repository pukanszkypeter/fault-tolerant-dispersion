import { Edge } from '../../core/Edge';

export class RotorRouterDispersionEdge extends Edge {
  constructor(id: number, fromID: number, toID: number) {
    super(id, fromID, toID);
  }
}
