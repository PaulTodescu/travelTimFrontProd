import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBusinessScheduleComponent } from './edit-business-schedule.component';

describe('TestComponent', () => {
  let component: EditBusinessScheduleComponent;
  let fixture: ComponentFixture<EditBusinessScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBusinessScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBusinessScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
