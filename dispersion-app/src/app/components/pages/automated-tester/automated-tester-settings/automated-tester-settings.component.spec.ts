import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedTesterSettingsComponent } from './automated-tester-settings.component';

describe('AutomatedTestSettingsComponent', () => {
  let component: AutomatedTesterSettingsComponent;
  let fixture: ComponentFixture<AutomatedTesterSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutomatedTesterSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomatedTesterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
