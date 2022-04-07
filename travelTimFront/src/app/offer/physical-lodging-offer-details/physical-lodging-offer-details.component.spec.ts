import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalLodgingOfferDetailsComponent } from './physical-lodging-offer-details.component';

describe('PhysicalLodgingOfferDetailsComponent', () => {
  let component: PhysicalLodgingOfferDetailsComponent;
  let fixture: ComponentFixture<PhysicalLodgingOfferDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalLodgingOfferDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalLodgingOfferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
