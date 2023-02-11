import { FormControl } from "@angular/forms";
import { GraphType, WindmillMode } from "./GraphType";

export enum FormStrategy {
  DEFAULT,
  CUSTOM,
}

export interface InputProps {
  [key: string]: FormControl;
}

type GraphSettings = {
  [key in GraphType]: InputProps;
};

export const graphSettings: GraphSettings = {
  BARABASI_ALBERT_FOREST: {
    tree: new FormControl<number>(
      { value: 1, disabled: true },
      { nonNullable: true, validators: [] }
    ),
    node: new FormControl(
      { value: 10, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
  BARABASI_ALBERT_GRAPH: {
    init: new FormControl(
      { value: 5, disabled: true },
      { nonNullable: true, validators: [] }
    ),
    edge: new FormControl(
      { value: 2, disabled: true },
      { nonNullable: true, validators: [] }
    ),
    node: new FormControl(
      { value: 10, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
  BARBELL: {
    node: new FormControl(
      { value: 18, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
  COMPLETE: {
    node: new FormControl(
      { value: 5, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
  GNM_RANDOM: {
    node: new FormControl(
      { value: 10, disabled: true },
      { nonNullable: true, validators: [] }
    ),
    edge: new FormControl(
      { value: 5, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
  GNP_RANDOM: {
    node: new FormControl(
      { value: 10, disabled: true },
      { nonNullable: true, validators: [] }
    ),
    propability: new FormControl(
      { value: 50, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
  GRID: {
    row: new FormControl(
      { value: 5, disabled: true },
      { nonNullable: true, validators: [] }
    ),
    column: new FormControl(
      { value: 5, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
  HYPER_CUBE: {
    dimension: new FormControl(
      { value: 5, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
  LINEAR: {
    size: new FormControl(
      { value: 10, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
  LOLLIPOP: {
    size: new FormControl(
      { value: 10, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
  RING: {
    size: new FormControl(
      { value: 10, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
  RANDOM_REGULAR: {
    node: new FormControl(
      { value: 5, disabled: true },
      { nonNullable: true, validators: [] }
    ),
    degree: new FormControl(
      { value: 2, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
  STAR: {
    order: new FormControl(
      { value: 5, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
  WHEEL: {
    size: new FormControl(
      { value: 10, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
  WINDMILL: {
    mode: new FormControl(
      { value: WindmillMode.WINDMILL, disabled: true },
      { nonNullable: true, validators: [] }
    ),
    copies: new FormControl(
      { value: 2, disabled: true },
      { nonNullable: true, validators: [] }
    ),
    size: new FormControl(
      { value: 5, disabled: true },
      { nonNullable: true, validators: [] }
    ),
  },
};
