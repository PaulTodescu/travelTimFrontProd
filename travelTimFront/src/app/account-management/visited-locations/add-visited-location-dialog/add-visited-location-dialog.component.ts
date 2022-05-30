import {Component, Injector, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {LocationService} from "../../../services/location/location.service";
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Location} from "../../../entities/Location";

@Component({
  selector: 'app-add-visited-location-dialog',
  templateUrl: './add-visited-location-dialog.component.html',
  styleUrls: ['./add-visited-location-dialog.component.scss']
})
export class AddVisitedLocationDialogComponent implements OnInit {

  constructor(
    private locationService: LocationService,
    private injector: Injector,
    private dialogRef: MatDialogRef<AddVisitedLocationDialogComponent>,
    private formBuilder: FormBuilder) { }

  cities: string[] = [];

  AddVisitedLocationForm: FormGroup = this.formBuilder.group({
    address: [undefined, [Validators.required, Validators.minLength(5)]],
    city:[undefined, [Validators.required]],
  })

  public getCities(): void{
    this.locationService.getCities().subscribe(
      (response: string[]) => {
        this.cities = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public addVisitedLocation(): void {
    let visitedLocation: Location = this.AddVisitedLocationForm.value;
    this.dialogRef.close({
      newVisitedLocation: visitedLocation
    });
  }

  public getFormAddressErrorMessage(){
    if (this.AddVisitedLocationForm.get('address')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.AddVisitedLocationForm.get('address')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }


  ngOnInit(): void {
    this.getCities();
  }

}
