import {AbstractControl, FormControl, ValidatorFn, Validators} from "@angular/forms";

export interface GraphType {
  value: string,
}

export const graphTypes: GraphType[] = [
  { value: 'complete'},
  { value: 'simpleLine'},
  { value: 'circle'},
  { value: 'barbell'},
  { value: 'lollipop'},
  { value: 'specialLine'},
  { value: 'grid'},
  { value: 'hypercube'},
  { value: 'er_random'}
];

export function hasNodeValueConstraint(type: string, control: FormControl): void {
  switch (type) {
    case graphTypes[3].value: // Barbell
      control.setValue(3);
      control.setValidators([Validators.min(1), Validators.max(50), Validators.required, barbellConstraint()]);
      break;
    case graphTypes[4].value: // Lollipop
      control.setValue(2);
      control.setValidators([Validators.min(1), Validators.max(50), Validators.required, lollipopConstraint()]);
      break;
    case graphTypes[7].value: // Hypercube
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
