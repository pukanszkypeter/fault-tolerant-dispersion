import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedTestSettingsComponent } from './automated-test-settings.component';

describe('AutomatedTestSettingsComponent', () => {
  let component: AutomatedTestSettingsComponent;
  let fixture: ComponentFixture<AutomatedTestSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomatedTestSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomatedTestSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
