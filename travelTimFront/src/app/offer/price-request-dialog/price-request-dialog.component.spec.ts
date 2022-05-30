import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceRequestDialogComponent } from './price-request-dialog.component';

describe('PriceRequestDialogComponent', () => {
  let component: PriceRequestDialogComponent;
  let fixture: ComponentFixture<PriceRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceRequestDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
