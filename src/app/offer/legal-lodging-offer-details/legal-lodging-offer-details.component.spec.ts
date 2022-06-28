import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalLodgingOfferDetailsComponent } from './legal-lodging-offer-details.component';

describe('LegalLodgingOfferDetailsComponent', () => {
  let component: LegalLodgingOfferDetailsComponent;
  let fixture: ComponentFixture<LegalLodgingOfferDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalLodgingOfferDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalLodgingOfferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
