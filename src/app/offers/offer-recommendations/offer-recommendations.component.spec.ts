import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferRecommendationsComponent } from './offer-recommendations.component';

describe('OfferRecommendationsComponent', () => {
  let component: OfferRecommendationsComponent;
  let fixture: ComponentFixture<OfferRecommendationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferRecommendationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
