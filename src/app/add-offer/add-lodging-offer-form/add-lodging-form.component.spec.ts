import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLodgingFormComponent } from './add-lodging-form.component';

describe('AddLodgingFormComponent', () => {
  let component: AddLodgingFormComponent;
  let fixture: ComponentFixture<AddLodgingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLodgingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLodgingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
