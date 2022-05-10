import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOfferImagesComponent } from './edit-offer-images.component';

describe('EditOfferImagesComponent', () => {
  let component: EditOfferImagesComponent;
  let fixture: ComponentFixture<EditOfferImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOfferImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOfferImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
