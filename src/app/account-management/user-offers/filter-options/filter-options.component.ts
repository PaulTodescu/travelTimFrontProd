import {Component, Inject, OnInit} from '@angular/core';
import {MatCheckboxChange} from "@angular/material/checkbox";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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
      businesses: string[],
      selectedBusiness: string | undefined,
      sortMethod: string,
      currency: string,
      status: string | undefined,
      nrRooms: number | undefined,
      nrSingleBeds: number | undefined,
      nrDoubleBeds: number | undefined
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
      this.data.selectedBusiness = undefined;
    }
  }

  public checkIfOfferedByPersonCheckBox(event: MatCheckboxChange) {
    if (event.checked) {
      this.data.offeredByPerson = true;
      this.data.offeredByBusiness = false;
      this.data.selectedBusiness = undefined;
    } else {
      this.data.offeredByPerson = false;
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

  public setSelectedBusiness(business: string): void{
    this.data.selectedBusiness = business;
  }

  public setSelectedSortMethod(sortMethod: string): void {
    this.data.sortMethod = sortMethod;
  }

  public setCurrency(currency: string) {
    this.data.currency = currency;
  }

  public setStatus(status: string) {
    this.data.status = status;
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

  public resetFilterOptions(): void {
    this.data.offeredByBusiness = false;
    this.data.offeredByPerson = false;
    this.data.selectedBusiness = undefined;
    this.data.sortMethod = 'latest';
    this.data.currency = 'RON';
    this.data.status = undefined;
    this.data.nrRooms = undefined;
    this.data.nrSingleBeds = undefined;
    this.data.nrDoubleBeds = undefined;
  }

  public sendFilterOptions(): void {
    this.dialogRef.close({
      offeredByBusiness: this.data.offeredByBusiness,
      offeredByPerson: this.data.offeredByPerson,
      selectedBusiness: this.data.selectedBusiness,
      sortMethod: this.data.sortMethod,
      currency: this.data.currency,
      status: this.data.status,
      nrRooms: this.data.nrRooms,
      nrSingleBeds: this.data.nrSingleBeds,
      nrDoubleBeds: this.data.nrDoubleBeds
    })
  }

  ngOnInit(): void {
  }
}
