import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProviderOffersComponent } from './user-provider-offers.component';

describe('UserProviderOffersComponent', () => {
  let component: UserProviderOffersComponent;
  let fixture: ComponentFixture<UserProviderOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProviderOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProviderOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
