import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActivityOfferComponent } from './edit-activity-offer.component';

describe('EditActivityOfferComponent', () => {
  let component: EditActivityOfferComponent;
  let fixture: ComponentFixture<EditActivityOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditActivityOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditActivityOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
