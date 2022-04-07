import {Component, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocationService} from "../../../services/location/location.service";
import {HttpErrorResponse} from "@angular/common/http";
import {BusinessService} from "../../../services/business/business.service";
import Swal from "sweetalert2";
import {MatDialogRef} from "@angular/material/dialog";
import {ImageService} from "../../../services/image/image.service";

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss']
})
export class AddBusinessComponent implements OnInit {

  cities: string[] | undefined;

  imagePath: string = 'Default';
  image: File | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private businessService: BusinessService,
    private imageService: ImageService,
    private injector: Injector) { }

  addBusinessForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)]],
    city: ['', [Validators.required, Validators.minLength(5)]],
    address:['', [Validators.required, Validators.minLength(5)]],
    cui: ['', [Validators.required]],
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

  public addBusiness(businessForm: FormGroup): void{
    this.businessService.addBusiness(businessForm.value).subscribe(
      (businessId: number) => {
        this.uploadImage(this.image, businessId);
        this.onSuccess("Business added successfully");
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public selectImage(event: Event): void {
    this.imagePath = 'Default';
    this.image = undefined;
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.imagePath = fileList[0].name;
      this.image = fileList[0];
    }
  }

  public uploadImage(image: File | undefined, businessId: number): void {
    this.imageService.uploadBusinessImage(image, businessId).subscribe(
      () => {},
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onSuccess(message: string): void{
    let dialogRef: MatDialogRef<AddBusinessComponent> = this.injector.get(MatDialogRef);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 2000
    }).then(function(){
      dialogRef.close();
    })
  }

  getFormNameErrorMessage() {
    if (this.addBusinessForm.get('name')?.hasError('required')){
      return 'you must enter a value';
    }
    else if (this.addBusinessForm.get('name')?.hasError('minlength')){
      return 'enter at least 3 characters';
    }
    else if (this.addBusinessForm.get('name')?.invalid){
      return 'only alphabetical characters and digits are allowed';
    }
    return;
  }

  getFormCityErrorMessage() {
    if (this.addBusinessForm.get('city')?.hasError('required')){
      return 'you must select a value';
    }
    return;
  }

  getFormCuiErrorMessage() {
    if (this.addBusinessForm.get('cui')?.hasError('required')){
      return 'you must enter a value';
    }
    return;
  }

  getFormAddressErrorMessage() {
    if (this.addBusinessForm.get('address')?.hasError('required')){
      return 'you must enter a value';
    }
    else if (this.addBusinessForm.get('address')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  ngOnInit(): void {
    this.getCities();
  }

}
