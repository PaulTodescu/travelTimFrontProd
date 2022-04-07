import {Component, Input, OnInit} from '@angular/core';
import {FoodMenuCategory} from "../../entities/foodMenuCategory";

@Component({
  selector: 'app-food-offer-menu',
  templateUrl: './food-offer-menu.component.html',
  styleUrls: ['./food-offer-menu.component.scss']
})
export class FoodOfferMenuComponent implements OnInit {

  @Input() foodMenu: FoodMenuCategory[] | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
