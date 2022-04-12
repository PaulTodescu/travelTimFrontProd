import {Component, Inject, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BusinessService} from "../../../services/business/business.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Business} from "../../../entities/business";
import {HttpErrorResponse} from "@angular/common/http";
import {LocationService} from "../../../services/location/location.service";
import Swal from "sweetalert2";
import {ImageService} from "../../../services/image/image.service";

@Component({
  selector: 'app-edit-business',
  templateUrl: './edit-business.component.html',
  styleUrls: ['./edit-business.component.scss']
})
export class EditBusinessComponent implements OnInit {

  businessToEdit: Business | undefined;
  cities: string[] | undefined;

  imageFiles: File[] = [];
  imageNames: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private businessService: BusinessService,
    private locationService: LocationService,
    private imageService: ImageService,
    private injector: Injector,
    @Inject(MAT_DIALOG_DATA) public data: { businessId: number }) { }

  editBusinessForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)]],
    city: [],
    address:['', [Validators.required, Validators.minLength(5)]],
    cui: ['', [Validators.required]],
  })

  private getBusinessToEdit(businessId: number): void {
    this.businessService.getBusinessById(businessId).subscribe(
      (response: Business) => {
        this.businessToEdit = response;
        this.setInitialValues(response);
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    )
  }

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

  public setInitialValues(business: Business): void {
    this.editBusinessForm.patchValue({
      name: business.name,
      city: business.city,
      address: business.address,
      cui: business.cui
    })
  }

  private getInitialImages(businessId: any) {
    this.imageService.getBusinessImagesNames(businessId).subscribe(
      (response: string[]) => {
        this.imageNames = response;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }

  public selectImages(event: any): void {
    if (event.target.files.length > 0 && event.target.files[0]) {
      this.imageNames = [];
      this.imageFiles = [];
      let numberImages = event.target.files.length;
      for (let i = 0; i < numberImages; i++) {
        this.imageNames.push(event.target.files[i].name);
        this.imageFiles.push(event.target.files[i]);
      }
    }
  }

  public getSelectedImages(): string {
    let result: string = '';
    for (let image of this.imageNames) {
      result = result + image + '\n';
    }
    return result;
  }

  public uploadImages(images: File[], businessId: number): void {
    if (images.length > 0) {
      this.imageService.uploadBusinessImages(images, businessId).subscribe(
        () => {
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public editBusiness(editBusinessForm: FormGroup): void {
    if (this.businessToEdit !== undefined) {
      this.businessService.editBusiness(editBusinessForm.value, this.businessToEdit.id).subscribe(
        () => {
          this.uploadImages(this.imageFiles, this.data.businessId);
          this.onSuccess();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public onSuccess(){
    let dialogRef: MatDialogRef<EditBusinessComponent> = this.injector.get(MatDialogRef);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Business was updated',
      showConfirmButton: false,
      showCancelButton: false,
      timer: 2000
    }).then(function(){
      dialogRef.close();
    })
  }

  getFormNameErrorMessage() {
    if (this.editBusinessForm.get('name')?.hasError('required')){
      return 'you must enter a value';
    }
    else if (this.editBusinessForm.get('name')?.hasError('minlength')){
      return 'enter at least 3 characters';
    }
    else if (this.editBusinessForm.get('name')?.invalid){
      return 'only alphabetical characters and digits are allowed';
    }
    return;
  }

  getFormCuiErrorMessage() {
    if (this.editBusinessForm.get('cui')?.hasError('required')){
      return 'you must enter a value';
    }
    return;
  }

  getFormAddressErrorMessage() {
    if (this.editBusinessForm.get('address')?.hasError('required')){
      return 'you must enter a value';
    }
    else if (this.editBusinessForm.get('address')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  ngOnInit(): void {
    this.getBusinessToEdit(this.data.businessId);
    this.getInitialImages(this.data.businessId);
    this.getCities();
  }

}
