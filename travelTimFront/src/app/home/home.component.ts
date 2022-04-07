import {Component, OnInit, ViewChild} from '@angular/core';
import {MapComponent} from "../map/map.component";
import {Address} from "ngx-google-places-autocomplete/objects/address";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild(MapComponent) mapComponent: any;

  bannerImage:string = 'assets/img/banner.png';

  showMapDirectionsInput: boolean = false;
  directionsInput: string | undefined;
  selectedTransportationOption = 'DRIVING';

  // values received from app-map
  directionsRequestStatus: boolean = false;
  originLocation: string | undefined;
  travelDistance: string | undefined;
  travelTime: string | undefined;

  originAddress : Address | undefined;

  constructor(private router: Router) {}

  public goToOffers(categoryName: string): void {
    this.router.navigate(['offers'], {
      queryParams: {'category': categoryName},
    });
  }

  public switchTransportationOption(option: string){
    let selectedTransportationOptionCopy: string = this.selectedTransportationOption;
    this.selectedTransportationOption = option;
    if (this.originAddress !== undefined && option !== selectedTransportationOptionCopy) {
      if (this.originAddress.formatted_address === undefined && this.directionsInput !== undefined){
        // if user types location manually without auto-complete
        this.mapComponent.getRoute(this.directionsInput, this.selectedTransportationOption);
      } else {
        this.mapComponent.getRoute(this.originAddress.formatted_address, this.selectedTransportationOption);
      }
    }
  }

  public toggleMapDirectionsInput(): void {
    this.showMapDirectionsInput = !this.showMapDirectionsInput;
    if (!this.showMapDirectionsInput){
      this.resetMap();
    }
  }

  public resetMap(): void {
    this.mapComponent.resetMap();
    this.directionsRequestStatus = false;
    this.directionsInput = '';
    this.selectedTransportationOption = 'DRIVING';
  }

  public getDirectionsRequestStatus(status: boolean): void {
    this.directionsRequestStatus = status;
  }

  public getOriginLocation(receivedOriginLocation: string): void {
    this.originLocation = receivedOriginLocation.substr(0, receivedOriginLocation.indexOf(','));
  }

  public getTravelDistance(receivedTravelDistance: string): void {
    this.travelDistance = receivedTravelDistance;
  }

  public getTravelTime(receivedTravelTime: string): void {
    this.travelTime = receivedTravelTime;
  }

  public getDirections(address: Address): void {
    this.originAddress = address;
    if (this.originAddress.formatted_address === undefined && this.directionsInput !== undefined){
      // if user types location manually without auto-complete
      this.mapComponent.getRoute(this.directionsInput, this.selectedTransportationOption);
    } else {
      this.mapComponent.getRoute(this.originAddress.formatted_address, this.selectedTransportationOption);
    }
  }

  ngOnInit(): void {
  }

}
