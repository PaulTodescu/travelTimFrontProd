import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersContainerComponent } from './offers-container.component';

describe('OffersContainerComponent', () => {
  let component: OffersContainerComponent;
  let fixture: ComponentFixture<OffersContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffersContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
