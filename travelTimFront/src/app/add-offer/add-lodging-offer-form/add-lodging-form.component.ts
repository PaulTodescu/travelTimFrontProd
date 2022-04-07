import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {Business} from "../../entities/business";
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddBusinessComponent} from "../../account-management/account/add-business/add-business.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocationService} from "../../services/location/location.service";
import Swal from "sweetalert2";
import {PhysicalPersonLodgingOffer} from "../../entities/physicalPersonLodgingOffer";
import {LegalPersonLodgingOffer} from "../../entities/legalPersonLodgingOffer";
import {LodgingUtility} from "../../entities/lodgingUtility";

@Component({
  selector: 'app-add-lodging-form',
  templateUrl: './add-lodging-form.component.html',
  styleUrls: ['./add-lodging-form.component.scss']
})
export class AddLodgingOfferFormComponent implements OnInit, OnDestroy {

  selectedPersonType: string | undefined;
  userBusinesses: Business[] | undefined;
  cities: string[] | undefined;
  utilities: LodgingUtility[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private userService: UserService,
    private locationService: LocationService) { }

  AddPhysicalPersonLodgingOfferForm: FormGroup = this.formBuilder.group({
    title:[undefined, [Validators.required, Validators.minLength(5)]],
    address:[undefined, [Validators.required, Validators.minLength(5)]],
    city:[undefined, [Validators.required]],
    nrRooms:[undefined, [Validators.required]],
    nrBathrooms:[undefined, [Validators.required]],
    nrSingleBeds:[undefined, [Validators.required]],
    nrDoubleBeds:[undefined, [Validators.required]],
    floor:[undefined, [Validators.required]],
    price:[undefined, [Validators.required, Validators.pattern("^[0-9]*$")]],
    currency:[undefined, [Validators.required]],
    description:[undefined, [Validators.minLength(10)]],
  })

  AddLegalPersonLodgingOfferForm: FormGroup = this.formBuilder.group({
    business:[undefined, [Validators.required]],
    nrRooms:[undefined, [Validators.required]],
    nrBathrooms:[undefined, [Validators.required]],
    nrSingleBeds:[undefined, [Validators.required]],
    nrDoubleBeds:[undefined, [Validators.required]],
    floor:[undefined, [Validators.required]],
    price:[undefined, [Validators.required, Validators.pattern("^[0-9]*$")]],
    currency:[undefined, [Validators.required]],
    description:[undefined, [Validators.minLength(10)]],
  })

  @Output() lodgingOfferTypeEvent:EventEmitter<string> = new EventEmitter<string>();

  physicalPersonLodgingOffer: PhysicalPersonLodgingOffer | undefined;
  @Output() physicalPersonLodgingFormEvent:EventEmitter<PhysicalPersonLodgingOffer>= new EventEmitter<PhysicalPersonLodgingOffer>();

  legalPersonLodgingOffer: LegalPersonLodgingOffer | undefined;
  @Output() legalPersonLodgingFormEvent:EventEmitter<LegalPersonLodgingOffer>= new EventEmitter<LegalPersonLodgingOffer>();

  @Output() legalPersonLodgingFormValidityEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() physicalPersonLodgingFormValidityEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  public switchPersonType(type: string): void {
    this.selectedPersonType = type;
    this.sendLodgingFormType();
    if (this.selectedPersonType === 'legal'){
      this.AddPhysicalPersonLodgingOfferForm.reset();
      this.physicalPersonLodgingFormValidityEvent.emit(false);
      this.getBusinessesForCurrentUser();
    } else if (this.selectedPersonType === 'physical'){
      this.AddLegalPersonLodgingOfferForm.reset();
      this.legalPersonLodgingFormValidityEvent.emit(false);
      this.getCities();
    }
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

  // sends lodging type to AddOfferContainer component
  public sendLodgingFormType(): void {
    if (this.selectedPersonType === 'legal') {
      this.lodgingOfferTypeEvent.emit('legal')
    } else if (this.selectedPersonType === 'physical') {
      this.lodgingOfferTypeEvent.emit('physical');
    }
  }

  // sends lodging form value to AddOfferContainer component
  public sendFormData(): void {
    if (this.selectedPersonType === 'legal') {
      this.sendLodgingFormType();
      let legalPersonLodgingOfferFormData = Object.assign({});
      legalPersonLodgingOfferFormData = Object.assign(legalPersonLodgingOfferFormData, this.AddLegalPersonLodgingOfferForm.value);

      this.legalPersonLodgingOffer = new LegalPersonLodgingOffer(
        legalPersonLodgingOfferFormData.business,
        legalPersonLodgingOfferFormData.nrRooms,
        legalPersonLodgingOfferFormData.nrBathrooms,
        legalPersonLodgingOfferFormData.nrSingleBeds,
        legalPersonLodgingOfferFormData.nrDoubleBeds,
        legalPersonLodgingOfferFormData.floor,
        legalPersonLodgingOfferFormData.price,
        legalPersonLodgingOfferFormData.currency,
        legalPersonLodgingOfferFormData.description,
        this.utilities)
        this.legalPersonLodgingFormEvent.emit(this.legalPersonLodgingOffer);

      if (this.AddLegalPersonLodgingOfferForm.valid){
        this.legalPersonLodgingFormValidityEvent.emit(true);
      } else {
        this.legalPersonLodgingFormValidityEvent.emit(false);
      }

    } else if (this.selectedPersonType === 'physical') {
      this.sendLodgingFormType();
      let physicalPersonLodgingOfferFormData = Object.assign({});
      physicalPersonLodgingOfferFormData = Object.assign(physicalPersonLodgingOfferFormData, this.AddPhysicalPersonLodgingOfferForm.value);

      this.physicalPersonLodgingOffer = new PhysicalPersonLodgingOffer(
        physicalPersonLodgingOfferFormData.title,
        physicalPersonLodgingOfferFormData.address,
        physicalPersonLodgingOfferFormData.city,
        physicalPersonLodgingOfferFormData.nrRooms,
        physicalPersonLodgingOfferFormData.nrBathrooms,
        physicalPersonLodgingOfferFormData.nrSingleBeds,
        physicalPersonLodgingOfferFormData.nrDoubleBeds,
        physicalPersonLodgingOfferFormData.floor,
        physicalPersonLodgingOfferFormData.price,
        physicalPersonLodgingOfferFormData.currency,
        physicalPersonLodgingOfferFormData.description,
        this.utilities)
      this.physicalPersonLodgingFormEvent.emit(this.physicalPersonLodgingOffer);

      if (this.AddPhysicalPersonLodgingOfferForm.valid){
        this.physicalPersonLodgingFormValidityEvent.emit(true);
      } else {
        this.physicalPersonLodgingFormValidityEvent.emit(false);
      }
    }
  }

  public getTitleFormErrorMessage(){
    if (this.AddPhysicalPersonLodgingOfferForm.get('title')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.AddPhysicalPersonLodgingOfferForm.get('title')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  public getAddressFormErrorMessage(){
    if (this.AddPhysicalPersonLodgingOfferForm.get('address')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.AddPhysicalPersonLodgingOfferForm.get('address')?.hasError('minlength')){
      return 'enter at least 5 characters';
    }
    return;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.legalPersonLodgingFormValidityEvent.emit(false);
    this.physicalPersonLodgingFormValidityEvent.emit(false);
  }

}

