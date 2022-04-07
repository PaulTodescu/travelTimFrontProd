import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOfferCategoriesSection } from './add-offer-categories-section';

describe('CategoriesSectionComponent', () => {
  let component: AddOfferCategoriesSection;
  let fixture: ComponentFixture<AddOfferCategoriesSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOfferCategoriesSection ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfferCategoriesSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
