import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBusinessesComponent } from './user-businesses.component';

describe('UserBusinessesComponent', () => {
  let component: UserBusinessesComponent;
  let fixture: ComponentFixture<UserBusinessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBusinessesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBusinessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
