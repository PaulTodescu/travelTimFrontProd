import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalLodgingOffersComponent } from './legal-lodging-offers.component';

describe('LegalLodgingOffersComponent', () => {
  let component: LegalLodgingOffersComponent;
  let fixture: ComponentFixture<LegalLodgingOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalLodgingOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalLodgingOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
