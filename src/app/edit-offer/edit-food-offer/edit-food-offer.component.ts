import {Component, Injector, OnInit} from '@angular/core';
import {FoodMenuItem} from "../../entities/foodMenuItem";
import {Business} from "../../entities/business";
import {UserService} from "../../services/user/user.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {AddBusinessComponent} from "../../business/add-business/add-business.component";
import {ActivatedRoute} from "@angular/router";
import {FoodService} from "../../services/food/food.service";
import {FoodOfferEditDTO} from "../../entities/foodOfferEditDTO";
import Swal from "sweetalert2";
import {ImageService} from "../../services/image/image.service";
import {Location} from "@angular/common";
import {OfferContact} from "../../entities/offerContact";
import {ContactService} from "../../services/contact/contact.service";

@Component({
  selector: 'app-edit-food-offer',
  templateUrl: './edit-food-offer.component.html',
  styleUrls: ['./edit-food-offer.component.scss']
})
export class EditFoodOfferComponent implements OnInit {

  id: number | undefined;
  foodOffer: FoodOfferEditDTO | undefined;
  menuCategories: string[] = [];
  foodMenu: Map<string, FoodMenuItem[]> = new Map<string, FoodMenuItem[]>();
  userBusinesses: Business[] | undefined;
  originalBusiness: Business | undefined;
  hasBusiness: boolean = true;
  images: File[] = [];
  contactDetails: OfferContact | undefined;
  isContactValid: boolean = true;

  constructor(
    private userService: UserService,
    private foodService: FoodService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private contactService: ContactService,
    private injector: Injector,
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
      data => {
        this.id = data.id;
        this.getFoodOfferToEdit();
      });
  }

  EditFoodOfferForm: FormGroup = this.formBuilder.group({
    business:[undefined],
    description: [undefined, [Validators.required, Validators.minLength(10)]]
  })

  public getFoodOfferToEdit(): void {
    if (this.id !== undefined){
      this.foodService.getFoodOfferForEdit(this.id).subscribe(
        (response: FoodOfferEditDTO) => {
          this.foodOffer = response;this.originalBusiness = response.business;
          this.setFoodOfferInitialValues(response);
          this.getInitialContactDetails(response.id);
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public setFoodOfferInitialValues(offer: FoodOfferEditDTO): void {
    this.EditFoodOfferForm.patchValue({
      business: offer.business,
      description: offer.description
    })

    for (let category of offer.foodMenuCategories){
      this.foodMenu.set(category.name, category.foodMenuItems);
    }
    this.menuCategories = Array.from(this.foodMenu.keys());
  }

  public getInitialContactDetails(offerId: number): void{
    this.contactService.getContactDetails(offerId, 'food').subscribe(
      (response: OfferContact) => {
        this.contactDetails = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getContactDetails(contactDetails: OfferContact) {
    this.contactDetails = contactDetails;
  }

  public checkContactValidity(isValid: boolean){
    this.isContactValid = isValid;
  }

  public editFoodOffer(): void {
    this.foodOffer = Object.assign(this.foodOffer, this.EditFoodOfferForm.value);
    if (this.foodOffer !== undefined && this.id !== undefined){
      if (this.hasBusiness &&
          this.originalBusiness?.name.localeCompare(this.foodOffer.business.name) !== 0){
        this.onFail("Selected business already has a food offer\nManage from your account");
        return;
      }
      if (!this.EditFoodOfferForm.valid){
        this.onFail("Form is invalid");
        return;
      }
      if (this.images.length < 1){
        this.onFail("Add at least one image");
        return;
      }
      if (!this.isContactValid){
        this.onFail("Invalid Contact Information");
        return;
      }
      for (let key of Array.from(this.foodMenu.keys())) {
        let items = this.foodMenu.get(key);
        if (items !== undefined) {
          if (items.length === 0) {
            this.onFail("Menu category should contain at least one item");
            return;
          }
          for (let menuItem of items) {
            if (menuItem.name === undefined ||
                menuItem.name === '' ||
                (menuItem.weight !== null && menuItem.weight <= 0) ||
                menuItem.price <= 0) {
              this.onFail("Invalid menu item added");
              return;
            }
          }
        }
      }
      this.foodService.editFoodOffer(this.foodOffer, this.id).subscribe(
        () => {
          if (this.id !== undefined){
            this.addFoodMenu(this.id);
          }
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  private editFoodOfferContactDetails() {
    if (this.id && this.contactDetails){
      this.contactService.setContactDetails(this.id, 'food', this.contactDetails).subscribe(
        () => {},
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
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

  compareBusinesses(b1: Business, b2: Business): boolean {
    if (b1 !== null && b2 !== null) {
      return b1.id === b2.id;
    }
    return false;
  }

  public getImages(receivedImages: File[]): void {
    this.images = receivedImages;
  }

  public getFormDescriptionErrorMessage(){
    if (this.EditFoodOfferForm.get('description')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.EditFoodOfferForm.get('description')?.hasError('minlength')){
      return 'enter at least 10 characters';
    }
    return;
  }

  public openFoodCategoryInputModal(): void {
    Swal.fire({
      inputPlaceholder: 'Category Name (E.g. PIZZA)',
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
        if (!this.menuCategories.includes(result.value)) {
          this.menuCategories.push(result.value);
          this.foodMenu.set(result.value, []);
        }
      }
    })
  }

  public openDeleteConfirmationDialog(category: string): void {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      focusConfirm: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#696969',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteMenuCategory(category);
      }
    })
  }

  public deleteMenuCategory(category: string): void {
    let index = this.menuCategories.indexOf(category);
    if (index !== -1){
      this.menuCategories.splice(index,1);
      this.foodMenu.delete(category);
    }
  }

  public addFoodMenu(foodOfferId: number): void {
    let foodMenuKeyValuePairs = {};
    this.foodMenu.forEach((value: FoodMenuItem[], key: string) => {
      Object.assign(foodMenuKeyValuePairs, {[key]: []})
      for (let menuItem of value){
        Object.assign(foodMenuKeyValuePairs, {[key]: value})
      }
    })
    if (this.foodOffer !== undefined) {
      this.foodService.addFoodMenu(foodOfferId, foodMenuKeyValuePairs).subscribe(
        () => {
          this.sendImages();
        },
        () => {
          this.onFail("Could not add menu");
        }
      )
    }
  }

  public addMenuItem(category: string): void {
    let index = this.menuCategories.indexOf(category);
    if (index !== -1){
      let itemsList = this.foodMenu.get(category);
      if (itemsList !== undefined) {
        itemsList.push(new FoodMenuItem('',NaN,0));
        this.foodMenu.set(category, itemsList);
      }
    }
  }

  public deleteMenuItem(category: string, itemIndex: number): void {
    let index = this.menuCategories.indexOf(category);
    if (index !== -1){
      let itemsList = this.foodMenu.get(category);
      if (itemsList !== undefined) {
        itemsList.splice(itemIndex,1)
        this.foodMenu.set(category, itemsList);
      }
    }
  }

  public getItemsForMenuCategory(category: string): FoodMenuItem[] {
    let menuItems =  this.foodMenu.get(category);
    if (menuItems !== undefined){
      return menuItems;
    }
    return [];
  }

  public changeMenuItemName(menuItemName: string, menuItemIndex:number, category: string): void {
    let itemsList = this.foodMenu.get(category);
    if (itemsList !== undefined) {
      let menuItem = itemsList[menuItemIndex];
      menuItem.name = menuItemName;
      itemsList.splice(menuItemIndex,1, menuItem);
      this.foodMenu.set(category, itemsList);
    }
  }

  public changeMenuItemWeight(menuItemWeight: string, menuItemIndex:number, category: string): void {
    let itemsList = this.foodMenu.get(category);
    if (itemsList !== undefined) {
      let menuItem = itemsList[menuItemIndex];
      if (Number(menuItemWeight) === 0){
        menuItem.weight = NaN;
      } else {
        menuItem.weight = Number(menuItemWeight);
      }
      itemsList.splice(menuItemIndex, 1, menuItem);
      this.foodMenu.set(category, itemsList);
    }
  }

  public changeMenuItemPrice(menuItemPrice: string, menuItemIndex:number, category: string): void {
    let itemsList = this.foodMenu.get(category);
    if (itemsList !== undefined) {
      let menuItem = itemsList[menuItemIndex];
      menuItem.price = Number(menuItemPrice);
      itemsList.splice(menuItemIndex, 1, menuItem);
      this.foodMenu.set(category, itemsList);
    }
  }

  public convertNumberToString(nr: number): string {
    if (nr > 0) {
      return String(nr);
    }
    return '';
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
      this.imageService.uploadOfferImages(this.id, 'food', this.images).subscribe(
        () => {
          this.editFoodOfferContactDetails();
          this.onSuccess();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  public checkIfBusinessHasFoodOffer(): void{
    if (this.foodOffer?.business !== undefined){
      let businessId = this.EditFoodOfferForm.get("business")?.value.id;
      this.foodService.checkIfBusinessHasFoodOffer(businessId).subscribe(
        (response: boolean) => {
          this.hasBusiness = response;
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
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
    this.checkIfBusinessHasFoodOffer();
  }

}
