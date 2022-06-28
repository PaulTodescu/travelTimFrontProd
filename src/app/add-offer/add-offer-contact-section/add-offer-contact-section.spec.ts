import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOfferContactSection } from './add-offer-contact-section';

describe('ContactSectionComponent', () => {
  let component: AddOfferContactSection;
  let fixture: ComponentFixture<AddOfferContactSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOfferContactSection ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfferContactSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
