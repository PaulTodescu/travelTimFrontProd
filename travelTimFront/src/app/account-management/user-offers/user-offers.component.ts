import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-offers',
  templateUrl: './user-offers.component.html',
  styleUrls: ['./user-offers.component.scss']
})
export class UserOffersComponent implements OnInit {

  selectedOption: string = 'all';

  constructor() { }

  public switchSelectedOption(option: string): void {
    this.selectedOption = option;
  }

  ngOnInit(): void {
  }

}
