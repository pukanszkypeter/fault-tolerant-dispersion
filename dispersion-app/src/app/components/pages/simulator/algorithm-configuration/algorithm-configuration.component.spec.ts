import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmConfigurationComponent } from './algorithm-configuration.component';

describe('AlgorithmConfigurationComponent', () => {
  let component: AlgorithmConfigurationComponent;
  let fixture: ComponentFixture<AlgorithmConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlgorithmConfigurationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
