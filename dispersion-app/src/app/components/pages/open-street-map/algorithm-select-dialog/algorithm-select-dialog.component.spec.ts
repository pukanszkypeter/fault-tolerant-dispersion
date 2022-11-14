import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmSelectDialogComponent } from './algorithm-select-dialog.component';

describe('AlgorithmSelectDialogComponent', () => {
  let component: AlgorithmSelectDialogComponent;
  let fixture: ComponentFixture<AlgorithmSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlgorithmSelectDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
