import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessOffersComponent } from './business-offers.component';

describe('BusinessOffersComponent', () => {
  let component: BusinessOffersComponent;
  let fixture: ComponentFixture<BusinessOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
