import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFoodOfferComponent } from './edit-food-offer.component';

describe('EditFoodOfferComponent', () => {
  let component: EditFoodOfferComponent;
  let fixture: ComponentFixture<EditFoodOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFoodOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFoodOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
