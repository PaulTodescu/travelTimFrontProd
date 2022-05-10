import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodOfferBusinessImagesComponent } from './food-offer-business-images.component';

describe('FoodOfferBusinessImagesComponent', () => {
  let component: FoodOfferBusinessImagesComponent;
  let fixture: ComponentFixture<FoodOfferBusinessImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodOfferBusinessImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodOfferBusinessImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
