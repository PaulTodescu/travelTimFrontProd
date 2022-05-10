import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessScheduleComponent } from './business-schedule.component';

describe('BusinessScheduleComponent', () => {
  let component: BusinessScheduleComponent;
  let fixture: ComponentFixture<BusinessScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
