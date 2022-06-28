import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivitiesOfferFormComponent } from './add-activities-offer-form.component';

describe('AddActivitiesOfferFormComponent', () => {
  let component: AddActivitiesOfferFormComponent;
  let fixture: ComponentFixture<AddActivitiesOfferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddActivitiesOfferFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivitiesOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
