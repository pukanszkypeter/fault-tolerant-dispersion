export enum Breakpoints {
  XS = "(min-width: 0px)",
  S = "(min-width: 576px)",
  M = "(min-width: 768px)",
  L = "(min-width: 992px)",
  XL = "(min-width: 1200px)",
  XXL = "(min-width: 1400px)",
}

export type BreakpointSettings = {
  [value in Breakpoints]: boolean;
};

export const getBreakpointKey = (value: Breakpoints) => {
  const index = Object.values(Breakpoints).indexOf(value);
  return Object.keys(Breakpoints)[index];
};
