import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOfferImagesSection } from './add-offer-images-section';

describe('ImagesSectionComponent', () => {
  let component: AddOfferImagesSection;
  let fixture: ComponentFixture<AddOfferImagesSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOfferImagesSection ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfferImagesSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
