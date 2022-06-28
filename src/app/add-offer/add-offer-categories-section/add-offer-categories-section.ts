import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-add-offer-categories-section',
  templateUrl: './add-offer-categories-section.html',
  styleUrls: ['./add-offer-categories-section.scss']
})
export class AddOfferCategoriesSection implements OnInit {

  selectedCategory: string | undefined;

  @Output() selectedCategoryEvent: EventEmitter<string> = new EventEmitter();

  constructor() { }

  public switchCategory(category: string){
    this.selectedCategory = category;
    this.selectedCategoryEvent.emit(this.selectedCategory); // send to add-offer-container
  }

  ngOnInit(): void {
  }

}
