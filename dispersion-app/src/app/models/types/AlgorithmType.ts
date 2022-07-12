export interface AlgorithmType {
  value: string
}

export const algorithmTypes: AlgorithmType[] = [
  { value: 'random'},
  { value: 'random_with_leader'},
  { value: 'rotor_router'},
  { value: 'rotor_router_with_leader'}
];
