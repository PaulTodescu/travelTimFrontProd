import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import Swal from "sweetalert2";
import {Business} from "../../entities/business";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../services/user/user.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddBusinessComponent} from "../../business/add-business/add-business.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {FoodOffer} from "../../entities/foodOffer";
import {FoodMenuItem} from "../../entities/foodMenuItem";

@Component({
  selector: 'app-add-food-offer-form',
  templateUrl: './add-food-offer-form.component.html',
  styleUrls: ['./add-food-offer-form.component.scss']
})
export class AddFoodOfferFormComponent implements OnInit, OnDestroy {

  menuCategories: string[] = [];
  foodMenu: Map<string, FoodMenuItem[]> = new Map<string, FoodMenuItem[]>();

  userBusinesses: Business[] | undefined;

  foodOffer: FoodOffer | undefined;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) { }

  AddFoodOfferForm: FormGroup = this.formBuilder.group({
    business:[undefined, [Validators.required]],
    description: [undefined, [Validators.required, Validators.minLength(10)]]
  })

  @Output() foodOfferFormEvent: EventEmitter<FoodOffer> = new EventEmitter<FoodOffer>();
  @Output() foodOfferFormValidityEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

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
          this.sendFormData();
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
      this.sendFormData();
    }
  }

  public addMenuItem(category: string): void {
    let index = this.menuCategories.indexOf(category);
    if (index !== -1){
      let itemsList = this.foodMenu.get(category);
      if (itemsList !== undefined) {
        itemsList.push(new FoodMenuItem('',NaN,0));
        this.foodMenu.set(category, itemsList);
        this.sendFormData();
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
        this.sendFormData();
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

  public getCategories(): IterableIterator<string>{
    return this.foodMenu.keys()
  }

  public changeMenuItemName(menuItemName: string, menuItemIndex:number, category: string): void {
    let itemsList = this.foodMenu.get(category);
    if (itemsList !== undefined) {
      let menuItem = itemsList[menuItemIndex];
      menuItem.name = menuItemName;
      itemsList.splice(menuItemIndex,1, menuItem);
      this.foodMenu.set(category, itemsList);
    }
    this.sendFormData()
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
    this.sendFormData();
  }

  public changeMenuItemPrice(menuItemPrice: string, menuItemIndex:number, category: string): void {
    let itemsList = this.foodMenu.get(category);
    if (itemsList !== undefined) {
      let menuItem = itemsList[menuItemIndex];
      menuItem.price = Number(menuItemPrice);
      itemsList.splice(menuItemIndex, 1, menuItem);
      this.foodMenu.set(category, itemsList);
    }
    this.sendFormData();
  }

  // sends food form value to AddOfferContainer component
  public sendFormData(): void {
    let foodOfferFormData = Object.assign({});
    foodOfferFormData = Object.assign(foodOfferFormData, this.AddFoodOfferForm.value);

    // convert map to key value pair array to be sent to the back-end
    let foodMenuKeyValuePairs = {};
    this.foodMenu.forEach((value: FoodMenuItem[], key: string) => {
      Object.assign(foodMenuKeyValuePairs, {[key]: []})
      for (let menuItem of value){
        Object.assign(foodMenuKeyValuePairs, {[key]: value})
      }
    })

    this.foodOffer = new FoodOffer(
      foodOfferFormData.business,
      foodOfferFormData.description,
      foodMenuKeyValuePairs
    )
    this.foodOfferFormEvent.emit(this.foodOffer);
    if (this.AddFoodOfferForm.valid){
      this.foodOfferFormValidityEvent.emit(true);
    } else {
      this.foodOfferFormValidityEvent.emit(false);
    }
  }

  public getFormDescriptionErrorMessage(){
    if (this.AddFoodOfferForm.get('description')?.hasError('required')){
      return 'you must enter a value';
    } else if (this.AddFoodOfferForm.get('description')?.hasError('minlength')){
      return 'enter at least 10 characters';
    }
    return;
  }

  ngOnInit(): void {
    this.getBusinessesForCurrentUser();
  }

  ngOnDestroy(): void {
    this.foodOfferFormValidityEvent.emit(false);
  }

}

