import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVisitedLocationDialogComponent } from './add-visited-location-dialog.component';

describe('AddVisitedLocationDialogComponent', () => {
  let component: AddVisitedLocationDialogComponent;
  let fixture: ComponentFixture<AddVisitedLocationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVisitedLocationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVisitedLocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
