import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessScheduleComponent } from './add-business-schedule.component';

describe('BusinessScheduleComponent', () => {
  let component: AddBusinessScheduleComponent;
  let fixture: ComponentFixture<AddBusinessScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBusinessScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusinessScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
