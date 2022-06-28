import {Component, Inject, Input, OnInit} from '@angular/core';
import {FoodMenuCategory} from "../../entities/foodMenuCategory";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-food-offer-menu',
  templateUrl: './food-offer-menu.component.html',
  styleUrls: ['./food-offer-menu.component.scss']
})
export class FoodOfferMenuComponent implements OnInit {

  @Input() foodMenu: FoodMenuCategory[] | undefined;

  constructor( @Inject(MAT_DIALOG_DATA) public data: {
    menu: FoodMenuCategory[]
  }) {
    if (this.data.menu){
      this.foodMenu = this.data.menu;
    }
  }

  ngOnInit(): void {
  }

}
