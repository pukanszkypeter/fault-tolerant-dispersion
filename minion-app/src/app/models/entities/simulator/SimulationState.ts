export interface SimulationState {
  value: string,
  color: string
}

export const simulationStates: SimulationState[] = [
  {value: 'not_configured', color: 'red'},
  {value: 'configured', color: 'green'},
  {value: 'running', color: 'blue'},
  {value: 'stopped', color: 'orange'}
];
