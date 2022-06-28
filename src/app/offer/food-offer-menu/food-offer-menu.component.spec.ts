import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodOfferMenuComponent } from './food-offer-menu.component';

describe('FoodOfferMenuComponent', () => {
  let component: FoodOfferMenuComponent;
  let fixture: ComponentFixture<FoodOfferMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodOfferMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodOfferMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
