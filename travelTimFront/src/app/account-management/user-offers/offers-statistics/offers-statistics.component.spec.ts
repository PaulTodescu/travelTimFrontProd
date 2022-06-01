import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersStatisticsComponent } from './offers-statistics.component';

describe('OffersStatisticsComponent', () => {
  let component: OffersStatisticsComponent;
  let fixture: ComponentFixture<OffersStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffersStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
