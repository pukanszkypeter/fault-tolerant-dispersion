import { GraphType, WindmillMode } from "./GraphType";

export enum FormStrategy {
  DEFAULT,
  CUSTOM,
}

export interface InputProps {
  [key: string]: string;
}

type GraphSettings = {
  [key in GraphType]: InputProps;
};

export const graphSettings: GraphSettings = {
  BARABASI_ALBERT_FOREST: {
    tree: String(1),
    node: String(10),
  },
  BARABASI_ALBERT_GRAPH: {
    init: String(5),
    edge: String(2),
    node: String(10),
  },
  BARBELL: {
    node: String(18),
  },
  COMPLETE: {
    node: String(5),
  },
  GNM_RANDOM: {
    node: String(10),
    edge: String(5),
  },
  GNP_RANDOM: {
    node: String(10),
    propability: String(0.5),
  },
  GRID: {
    row: String(5),
    column: String(5),
  },
  HYPER_CUBE: {
    dimension: String(5),
  },
  LINEAR: {
    size: String(10),
  },
  LOLLIPOP: {
    size: String(10),
  },
  RING: {
    size: String(10),
  },
  RANDOM_REGULAR: {
    node: String(5),
    degree: String(2),
  },
  STAR: {
    order: String(5),
  },
  WHEEL: {
    size: String(10),
  },
  WINDMILL: {
    mode: WindmillMode.WINDMILL,
    copies: String(2),
    size: String(5),
  },
};

export function getGraphInputs(type: GraphType): HTMLInputElement[] {
  return Object.keys(graphSettings[type]).map(
    (key) => document.getElementById(key) as HTMLInputElement
  );
}

export function manipulateGraphSettings(
  type: GraphType,
  strategy: FormStrategy
): void {
  let inputs = getGraphInputs(type);

  if (strategy === FormStrategy.DEFAULT) {
    inputs.forEach((i) => [
      (i.disabled = true),
      (i.value = graphSettings[type][i.id]),
    ]);
  } else {
    inputs.forEach((i) => [(i.disabled = false), (i.value = "")]);
  }
}

export function getGraphSettings(type: GraphType, strategy: FormStrategy): any {
  let settings = Object.assign(graphSettings[type]);

  if (strategy === FormStrategy.CUSTOM) {
    let inputs = getGraphInputs(type);
    inputs.forEach((i) => (settings[i.id] = i.value));
    return settings;
  }

  return settings;
}
