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

  imagePath: string | undefined;
  originalImagePath: string | undefined;
  image: File | undefined;

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

  public editBusiness(editBusinessForm: FormGroup): void {
    if (this.businessToEdit !== undefined) {
      this.businessService.editBusiness(editBusinessForm.value, this.businessToEdit.id).subscribe(
        () => {
          if (this.imagePath !== this.originalImagePath){
            this.uploadImage(this.image, this.data.businessId);
          }
          this.onSuccess();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  private getOriginalImagePath(businessId: any) {
    this.imageService.getBusinessImagePath(businessId).subscribe(
      (response: string) => {
        this.imagePath = response;
        this.originalImagePath = response;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }

  public selectImage(event: Event): void {
    this.imagePath = this.originalImagePath;
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
    this.getOriginalImagePath(this.data.businessId);
    this.getCities();
  }

}
