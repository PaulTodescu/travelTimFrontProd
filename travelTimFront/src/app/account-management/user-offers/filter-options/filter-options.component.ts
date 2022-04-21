import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MatCheckboxChange} from "@angular/material/checkbox";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-filter-options',
  templateUrl: './filter-options.component.html',
  styleUrls: ['./filter-options.component.scss']
})
export class FilterOptionsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      offerCategory: string,
      offeredByBusiness: boolean,
      offeredByPerson: boolean,
      selectedBusinessId: number,
      sortMethod: string,
      currency: string,
      nrRooms: number,
      nrSingleBeds: number,
      nrDoubleBeds: number
    },
    private dialogRef: MatDialogRef<FilterOptionsComponent>) {}

  public counter(nr: number): Array<number> {
    return new Array(nr);
  }

  public checkIfOfferedByBusinessCheckBox(event: MatCheckboxChange) {
    if (event.checked) {
      this.data.offeredByBusiness = true;
      this.data.offeredByPerson = false;
    } else {
      this.data.offeredByBusiness = false;
    }
  }

  public checkIfOfferedByPersonCheckBox(event: MatCheckboxChange) {
    if (event.checked) {
      this.data.offeredByPerson = true;
      this.data.offeredByBusiness = false;
    }
  }

  public showOfferTypeFilterOption(): boolean {
    let category: string = this.data.offerCategory;
    return category === 'lodging' || category === 'attractions' || category === 'activities';
  }

  public showCurrencyFilterOption(): boolean {
    return this.data.offerCategory === 'lodging';
  }

  public showLodgingFilterOptions(): boolean {
    return this.data.offerCategory === 'lodging';
  }

  public showBusinessFilterOption(): boolean {
    return this.data.offerCategory === 'food & beverage';
  }

  public setSelectedSortMethod(sortMethod: string): void {
    this.data.sortMethod = sortMethod;
  }

  public setCurrency(currency: string) {
    this.data.currency = currency;
  }

  public setNrRooms(nrRooms: number) {
    this.data.nrRooms = nrRooms;
  }

  public setNrSingleBeds(nrSingleBeds: number) {
    this.data.nrSingleBeds = nrSingleBeds;
  }

  public setNrDoubleBeds(nrDoubleBeds: number) {
    this.data.nrDoubleBeds = nrDoubleBeds;
  }

  public sendFilterOptions(): void {
    this.dialogRef.close({
      offeredByBusiness: this.data.offeredByBusiness,
      offeredByPerson: this.data.offeredByPerson,
      sortMethod: this.data.sortMethod,
      currency: this.data.currency,
      nrRooms: this.data.nrRooms,
      nrSingleBeds: this.data.nrSingleBeds,
      nrDoubleBeds: this.data.nrDoubleBeds
    })
  }

  ngOnInit(): void {
  }
}
