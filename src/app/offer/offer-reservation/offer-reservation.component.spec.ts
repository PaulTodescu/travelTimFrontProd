import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferReservationComponent } from './offer-reservation.component';

describe('OfferReservationComponent', () => {
  let component: OfferReservationComponent;
  let fixture: ComponentFixture<OfferReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferReservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
