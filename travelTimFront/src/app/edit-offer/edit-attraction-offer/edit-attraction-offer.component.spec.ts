import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAttractionOfferComponent } from './edit-attraction-offer.component';

describe('EditAttractionOfferComponent', () => {
  let component: EditAttractionOfferComponent;
  let fixture: ComponentFixture<EditAttractionOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAttractionOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAttractionOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
