import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledOfferDialogComponent } from './disabled-offer-dialog.component';

describe('DisabledOfferDialogComponent', () => {
  let component: DisabledOfferDialogComponent;
  let fixture: ComponentFixture<DisabledOfferDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisabledOfferDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabledOfferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
