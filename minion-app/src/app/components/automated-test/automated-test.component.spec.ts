import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedTestComponent } from './automated-test.component';

describe('AutomatedTestComponent', () => {
  let component: AutomatedTestComponent;
  let fixture: ComponentFixture<AutomatedTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomatedTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomatedTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
