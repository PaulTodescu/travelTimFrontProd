import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {LocationService} from "../../services/location/location.service";
import {Business} from "../../entities/business";
import {LodgingUtility} from "../../entities/lodgingUtility";
import Swal from "sweetalert2";
import {PhysicalPersonLodgingOfferEditDTO} from "../../entities/physicalPersonLodgingOfferEditDTO";
import {LodgingService} from "../../services/lodging/lodging.service";
import {UserService} from "../../services/user/user.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddBusinessComponent} from "../../business/add-business/add-business.component";
import {LegalPersonLodgingOfferEditDTO} from "../../entities/legalPersonLodgingOfferEditDTO";
import {ImageService} from "../../services/image/image.service";
import {Location} from "@angular/common";
import {OfferContact} from "../../entities/offerContact";
import {ContactService} from "../../services/contact/contact.service";

@Component({
  selector: 'app-edit-lodging-offer-form',
  templateUrl: './edit-lodging-offer-form.component.html',
  styleUrls: ['./edit-lodging-offer-form.component.scss']
})
export class EditLodgingOfferFormComponent implements OnInit {

  id: number | undefined;
  type: string | undefined;
  userBusinesses: Business[] | undefined;
  cities: string[] | undefined;
  utilities: LodgingUtility[] = [];
  legalPersonLodgingOffer: LegalPersonLodgingOfferEditDTO | undefined;
  physicalPersonLodgingOffer: PhysicalPersonLodgingOfferEditDTO | undefined;
  images: File[] = [];
  contactDetails: OfferContact | undefined;
  isContactValid: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private userService: UserService,
    private locationService: LocationService,
    private lodgingService: LodgingService,
    private imageService: ImageService,
    private contactService: ContactService,
    private injector: Injector,
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
      data => {
        this.id = data.id;
        this.type = data.type;
      });
  }

  EditLegalPersonLodgingOfferForm: FormGroup = this.formBuilder.group({
    business:[],
    nrRooms:[undefined],
    nrBathrooms:[undefined],
    nrSingleBeds:[undefined],
    nrDoubleBeds:[undefined],
    floor:[undefined],
    price:[undefined, [Validators.required, Validators.pattern("^[0-9]*$")]],
    currency:[undefined],
    description:[undefined, [Validators.minLength(10)]],
  })

  EditPhysicalPersonLodgingOfferForm: FormGroup = this.formBuilder.group({
    title:[undefined, [Validators.required, Validators.minLength(5)]],
    address:[undefined, [Validators.required, Validators.minLength(5)]],
    city:[undefined],
    nrRooms:[undefined],
    nrBathrooms:[undefined],
    nrSingleBeds:[undefined],
    nrDoubleBeds:[undefined],
    floor:[undefined],
    price:[undefined, [Validators.required, Validators.pattern("^[0-9]*$")]],
    currency:[undefined],
    description:[undefined, [Validators.minLength(10)]],
  })

  public getLodgingOfferToEdit(): void {
    if (this.id !== undefined) {
      if (this.type === 'legal') {
        this.lodgingService.getLegalPersonLodgingOfferForEdit(this.id).subscribe(
          (response: LegalPersonLodgingOfferEditDTO) => {
            this.legalPersonLodgingOffer = response;
            this.setLegalPersonLodgingOfferInitialValues(response);
            this.getInitialContactDetails(response.id);
          }, (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
      }
      else if (this.type === 'physical') {
        this.lodgingService.getPhysicalPersonLodgingOfferForEdit(this.id).subscribe(
          (response: PhysicalPersonLodgingOfferEditDTO) => {
            this.physicalPersonLodgingOffer = response;
            this.setPhysicalPersonLodgingOfferInitialValues(response);
            this.getInitialContactDetails(response.id);
          }, (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
      }
    }
  }

  public getInitialContactDetails(offerId: number): void{
    this.contactService.getContactDetails(offerId, 'lodging').subscribe(
      (response: OfferContact) => {
        this.contactDetails = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public setPhysicalPersonLodgingOfferInitialValues(offer: PhysicalPersonLodgingOfferEditDTO): void {
    this.EditPhysicalPersonLodgingOfferForm.patchValue({
      title: offer.title,
      address: offer.address,
      city: offer.city,
      nrRooms: offer.nrRooms,
      nrBathrooms: offer.nrBathrooms,
      nrSingleBeds: offer.nrSingleBeds,
      nrDoubleBeds: offer.nrDoubleBeds,
      floor: offer.floor,
      price: offer.price,
      currency: offer.currency,
      description: offer.description,
    })
    this.utilities = offer.utilities;
  }

  public setLegalPersonLodgingOfferInitialValues(offer: LegalPersonLodgingOfferEditDTO): void {
    this.EditLegalPersonLodgingOfferForm.patchValue({
      business: offer.business,
      nrRooms: offer.nrRooms,
      nrBathrooms: offer.nrBathrooms,
      nrSingleBeds: offer.nrSingleBeds,
      nrDoubleBeds: offer.nrDoubleBeds,
      floor: offer.floor,
      price: offer.price,
      currency: offer.currency,
      description: offer.description,
    })
    this.utilities = offer.utilities;
  }

  public editLodgingOffer(): void {
    if (this.images.length < 1){
      this.onFail("Add at least one image");
      return;
    }
    if (!this.isContactValid){
      this.onFail("Invalid Contact Information");
      return;
    }
    if (this.type === 'legal'){
      if (!this.EditLegalPersonLodgingOfferForm.valid){
        this.onFail("Form is invalid");
      } else {
        this.editLegalPersonLodgingOffer();
      }
    } else if (this.type === 'physical'){
      if (!this.EditPhysicalPersonLodgingOfferForm.valid){
        this.onFail("Form is invalid");
      } else {
        this.editPhysicalPersonLodgingOffer();
      }
    }
  }

  public editLegalPersonLodgingOffer(): void {
    this.legalPersonLodgingOffer = Object.assign(this.legalPersonLodgingOffer, this.EditLegalPersonLodgingOfferForm.value);
    if (this.legalPersonLodgingOffer !== undefined && this.id !== undefined) {
      this.lodgingService.editLegalPersonLodgingOffer(this.legalPersonLodgingOffer, this.id).subscribe(
        () => {
          this.sendImages();
          this.editLodgingOfferContactDetails();
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public editPhysicalPersonLodgingOffer(): void {
    this.physicalPersonLodgingOffer = Object.assign(this.physicalPersonLodgingOffer, this.EditPhysicalPersonLodgingOfferForm.value);
    if (this.physicalPersonLodgingOffer !== undefined && this.id !== undefined) {
      this.lodgingService.editPhysicalPersonLodgingOffer(this.physicalPersonLodgingOffer, this.id).subscribe(
        () => {
          this.sendImages();
          this.editLodgingOfferContactDetails();
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  private editLodgingOfferContactDetails() {
    if (this.id && this.contactDetails){
      this.contactService.setContactDetails(this.id, 'lodging', this.contactDetails).subscribe(
        () => {},
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public getContactDetails(contactDetails: OfferContact) {
    this.contactDetails = contactDetails;
  }

  public checkContactValidity(isValid: boolean){
    this.isContactValid = isValid;
  }

  public counter(nr: number): Array<number> {
    return new Array(nr);
  }

  private getBusinessesForCurrentUser() {
    this.userService.getBusinessesForCurrentUser().subscribe(
      (response: Business[]) => {
        this.userBusinesses = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  compareBusinesses(b1: Business, b2: Business): boolean {
    if (b1 !== null && b2 !== null) {
      return b1.id === b2.id;
    }
    return false;
  }

  public openAddBusinessModal(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-class' // in styles.css
    this.dialog.open(AddBusinessComponent, dialogConfig);
    this.dialog._getAfterAllClosed().subscribe(() => {
      this.getBusinessesForCurrentUser();
    });
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

  public openUtilityInputModal(): void {
    Swal.fire({
      inputPlaceholder: 'Service Name (E.g. WIFI, TV, etc.)',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Add',
      focusConfirm: false,
      focusCancel: false,
      confirmButtonColor: '#034953',
      cancelButtonColor: '#696969',
    }).then((result) => {
      if (result.isConfirmed && result.value.length !== 0) {
        this.utilities.push(new LodgingUtility(result.value));
      }
    })
  }

  public deleteUtility(utilityIndex: number): void {
    this.utilities.splice(utilityIndex,1);
  }

  public getImages(receivedImages: File[]): void {
    this.images = receivedImages;
  }

  public sendImages(): void {
    if (this.id !== undefined){
      Swal.fire({
        title: 'Please Wait...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      });
      this.imageService.uploadOfferImages(this.id, 'lodging', this.images).subscribe(
        () => {
          this.onSuccess();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  public getTitleFormErrorMessage(){
    if (this.EditPhysicalPersonLodgingOfferForm.get('title')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.EditPhysicalPersonLodgingOfferForm.get('title')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  public getAddressFormErrorMessage(){
    if (this.EditPhysicalPersonLodgingOfferForm.get('address')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.EditPhysicalPersonLodgingOfferForm.get('address')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  public onSuccess(): void{
    let location: Location = this.injector.get(Location);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Offer was updated',
      showConfirmButton: false,
      timer: 2000
    }).then(function(){
      location.back();
    })
  }

  public onFail(message: string): void{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 2500
    }).then(function(){})
  }

  ngOnInit(): void {
    this.getBusinessesForCurrentUser();
    this.getCities();
    this.getLodgingOfferToEdit();
  }
}
