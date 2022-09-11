import {AbstractControl, FormControl, ValidatorFn, Validators} from "@angular/forms";

export enum GraphType {
  COMPLETE = 'COMPLETE',
  SIMPLE_LINE = 'SIMPLE_LINE',
  CIRCLE = 'CIRCLE',
  BARBELL = 'BARBELL',
  LOLLIPOP = 'LOLLIPOP',
  SPECIAL_LINE = 'SPECIAL_LINE',
  GRID = 'GRID',
  HYPER_CUBE = 'HYPER_CUBE',
  ER_RANDOM = 'ER_RANDOM'
}

export function hasNodeValueConstraint(graphType: GraphType | string, control: FormControl): void {
  switch (graphType) {
    case GraphType.BARBELL:
      control.setValue(3);
      control.setValidators([Validators.min(1), Validators.max(50), Validators.required, barbellConstraint()]);
      break;
    case GraphType.LOLLIPOP:
      control.setValue(2);
      control.setValidators([Validators.min(1), Validators.max(50), Validators.required, lollipopConstraint()]);
      break;
    case GraphType.HYPER_CUBE:
      control.setValue(2);
      control.setValidators([Validators.min(1), Validators.max(50), Validators.required, hypercubeConstraint()]);
      break;
    default:
      control.setValidators([Validators.min(1), Validators.max(50), Validators.required]);
  }
}

export function barbellConstraint(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any} | null =>
    (control.value % 3 != 0) ? {barbellConstraintError: control.value} : null;
}

export function lollipopConstraint(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any} | null =>
    (control.value % 2 != 0) ? {lollipopConstraintError: control.value} : null;
}

export function hypercubeConstraint(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any} | null => {
    let count = 0;
    let number = control.value;
    while (number) {
      number = number & (number - 1);
      count++;
    }
    return (count != 1) ? {hypercubeConstraintError: control.value}: null;
  }
}
