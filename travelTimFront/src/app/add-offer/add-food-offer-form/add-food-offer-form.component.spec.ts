import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFoodOfferFormComponent } from './add-food-offer-form.component';

describe('AddFoodOfferFormComponent', () => {
  let component: AddFoodOfferFormComponent;
  let fixture: ComponentFixture<AddFoodOfferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFoodOfferFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFoodOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
