import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOfferContactComponent } from './edit-offer-contact.component';

describe('EditOfferContactComponent', () => {
  let component: EditOfferContactComponent;
  let fixture: ComponentFixture<EditOfferContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOfferContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOfferContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
