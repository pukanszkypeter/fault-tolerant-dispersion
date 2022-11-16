export enum NodeState {
  DEFAULT = 'DEFAULT',
  PENDING = 'PENDING',
  OCCUPIED = 'OCCUPIED',
}

export function getNodeStateColor(state: NodeState): string {
  switch (state) {
    case NodeState.DEFAULT:
      return '#ffffff';
    case NodeState.PENDING:
      return '#ff0000';
    case NodeState.OCCUPIED:
      return '#33cc33';
    default:
      throw new Error('Node state not found!');
  }
}
