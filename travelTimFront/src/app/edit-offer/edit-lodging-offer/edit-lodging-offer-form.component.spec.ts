import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLodgingOfferFormComponent } from './edit-lodging-offer-form.component';

describe('EditLodgingOfferFormComponent', () => {
  let component: EditLodgingOfferFormComponent;
  let fixture: ComponentFixture<EditLodgingOfferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLodgingOfferFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLodgingOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
