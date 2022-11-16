import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphConfigurationComponent } from './graph-configuration.component';

describe('SettingsDialogComponent', () => {
  let component: GraphConfigurationComponent;
  let fixture: ComponentFixture<GraphConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphConfigurationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
