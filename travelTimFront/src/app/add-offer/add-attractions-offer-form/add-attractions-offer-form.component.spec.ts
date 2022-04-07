import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttractionsOfferFormComponent } from './add-attractions-offer-form.component';

describe('AddAttractionsOfferFormComponent', () => {
  let component: AddAttractionsOfferFormComponent;
  let fixture: ComponentFixture<AddAttractionsOfferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAttractionsOfferFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttractionsOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
