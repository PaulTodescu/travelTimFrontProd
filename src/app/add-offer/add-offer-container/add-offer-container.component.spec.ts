import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOfferContainerComponent } from './add-offer-container.component';

describe('AddOfferContainerComponent', () => {
  let component: AddOfferContainerComponent;
  let fixture: ComponentFixture<AddOfferContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOfferContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfferContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
