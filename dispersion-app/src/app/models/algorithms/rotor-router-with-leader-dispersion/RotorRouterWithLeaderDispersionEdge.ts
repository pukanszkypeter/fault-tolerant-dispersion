import { Edge } from '../../core/Edge';

export class RotorRouterWithLeaderDispersionEdge extends Edge {
  constructor(id: number, fromID: number, toID: number) {
    super(id, fromID, toID);
  }
}
