import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferTicketsComponent } from './offer-tickets.component';

describe('OfferTicketsComponent', () => {
  let component: OfferTicketsComponent;
  let fixture: ComponentFixture<OfferTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
