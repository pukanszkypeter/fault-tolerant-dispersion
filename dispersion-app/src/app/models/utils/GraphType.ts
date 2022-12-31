import {
  AbstractControl,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export enum GraphType {
  BARABASI_ALBERT_FOREST = 'BARABASI_ALBERT_FOREST',
  BARABASI_ALBERT_GRAPH = 'BARABASI_ALBERT_GRAPH',
  BARBELL = 'BARBELL',
  // COMPLEMENT = 'COMPLEMENT',
  COMPLETE_BIPARTITE = 'COMPLETE_BIPARTITE',
  COMPLETE = 'COMPLETE',
  // DIRECTED_SCALE_FREE = 'DIRECTED_SCALE_FREE',
  EMPTY_GRAPH = 'EMPTY_GRAPH',
  // GENERALIZED_PETERSEN = 'GENERALIZED_PETERSEN',
  GNM_RANDOM_BIPARTITE = 'GNM_RANDOM_BIPARTITE',
  GNM_RANDOM = 'GNM_RANDOM',
  GNP_RANDOM_BIPARTITE = 'GNP_RANDOM_BIPARTITE',
  GNP_RANDOM = 'GNP_RANDOM',
  GRID = 'GRID',
  HYPER_CUBE = 'HYPER_CUBE',
  KLEINBERG_SMALL_WORLD = 'KLEINBERG_SMALL_WORLD',
  LINEAR = 'LINEAR',
  LINEARIZED_CHORD_DIAGRAM = 'LINEARIZED_CHORD_DIAGRAM',
  LOLLIPOP = 'LOLLIPOP',
  // NAMED = 'NAMED',
  PLANTED_PARTITION = 'PLANTED_PARTITION',
  PRUFER_TREE = 'PRUFER_TREE',
  RANDOM_REGULAR = 'RANDOM_REGULAR',
  RING = 'RING',
  SCALE_FREE = 'SCALE_FREE',
  // SIMPLE_WEIGHTED_BIPARTITE = 'SIMPLE_WEIGHTED_BIPARTITE',
  // SIMPLE_WEIGHTED = 'SIMPLE_WEIGHTED',
  SPECIAL_LINE = 'SPECIAL_LINE',
  STAR = 'STAR',
  // WATTS_STROGATZ = 'WATTS_STROGATZ',
  WHEEL = 'WHEEL',
  WINDMILL = 'WINDMILL',
}

/*
export function hasNodeValueConstraint(
  graphType: GraphType | string,
  control: FormControl
): void {
  switch (graphType) {
    case GraphType.BARBELL:
      control.setValue(3);
      control.setValidators([
        Validators.min(1),
        Validators.max(50),
        Validators.required,
        barbellConstraint(),
      ]);
      break;
    case GraphType.LOLLIPOP:
      control.setValue(2);
      control.setValidators([
        Validators.min(1),
        Validators.max(50),
        Validators.required,
        lollipopConstraint(),
      ]);
      break;
    case GraphType.HYPER_CUBE:
      control.setValue(2);
      control.setValidators([
        Validators.min(1),
        Validators.max(50),
        Validators.required,
        hypercubeConstraint(),
      ]);
      break;
    default:
      control.setValidators([
        Validators.min(1),
        Validators.max(50),
        Validators.required,
      ]);
  }
}

export function barbellConstraint(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null =>
    control.value % 3 != 0 ? { barbellConstraintError: control.value } : null;
}

export function lollipopConstraint(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null =>
    control.value % 2 != 0 ? { lollipopConstraintError: control.value } : null;
}

export function hypercubeConstraint(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let count = 0;
    let number = control.value;
    while (number) {
      number = number & (number - 1);
      count++;
    }
    return count != 1 ? { hypercubeConstraintError: control.value } : null;
  };
}
*/
