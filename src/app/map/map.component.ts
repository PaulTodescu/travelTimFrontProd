import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import Swal from "sweetalert2";
import {OfferDistance} from "../entities/offerDistance";
declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  map: any;

  @ViewChild('mapElement', {static: true}) mapElement: any;

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  coordinates = { lat: 45.760696, lng: 21.226788 };

  @Output() directionsRequestStatusEvent:EventEmitter<boolean> = new EventEmitter();
  @Output() originLocationEvent:EventEmitter<string> = new EventEmitter();
  @Output() travelDistanceEvent:EventEmitter<string>= new EventEmitter();
  @Output() travelTimeEvent:EventEmitter<string>= new EventEmitter();

  @Output() offerDistanceEvent:EventEmitter<OfferDistance>= new EventEmitter();

  constructor() { }


  public getRoute(originLocation: string, selectedTravelMode: string): void{
    let travelMode: string = '';
    if (selectedTravelMode === "DRIVING"){
      travelMode = google.maps.TravelMode.DRIVING;
    }
    else if (selectedTravelMode === "WALKING"){
      travelMode = google.maps.TravelMode.WALKING;
    }
    // else if (selectedTravelMode === "BICYCLING"){
    //   travelMode = google.maps.TravelMode.BICYCLING;
    // }
    else if (selectedTravelMode === "TRANSIT"){
      travelMode = google.maps.TravelMode.TRANSIT;
    }
    let request = {
      origin: originLocation,
      destination: 'Timișoara, Romania',
      travelMode: travelMode,
      unitSystem: google.maps.UnitSystem.METRIC
    }
    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRequestStatusEvent.emit(true);
        this.originLocationEvent.emit(result.routes[0].legs[0].start_address);
        this.travelDistanceEvent.emit(result.routes[0].legs[0].distance.text);
        this.travelTimeEvent.emit(result.routes[0].legs[0].duration.text);
        this.directionsRenderer.setDirections(result);
      } else {
        this.directionsRequestStatusEvent.emit(false);
        this.directionsRenderer.setDirections({routes: []});
        this.map.setCenter(this.coordinates);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Could not find route',
          showConfirmButton: false,
          timer: 2500
        }).then(function(){})
      }
    })
  }

  public resetMap(): void {
    this.directionsRenderer.setDirections({routes: []});
    this.map.setCenter(this.coordinates);
    this.map.setZoom(12);
  }

  public setMarker(address: string): void {
    let map = new google.maps.Map(this.mapElement.nativeElement, {
      center: this.coordinates,
      zoom: 14,
      mapTypeId: 'roadmap'
    });
    let geocoder= new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function (results: any, status: any) {
      if (status === 'OK') {
        new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
        map.setCenter(results[0].geometry.location);
      } else {
        console.log('Geocode was not successful, status: ' + status);
      }
    })
  }

  public getDistance(offerId: number, originLocation: string, destinationLocation: string): void{
    let request = {
      origin: originLocation,
      destination: destinationLocation,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC
    }
    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.offerDistanceEvent.emit(new OfferDistance(offerId, result.routes[0].legs[0].distance.text));
      }
    });
  }

  public setInitialMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: this.coordinates,
      zoom: 12,
      mapTypeId: 'roadmap'
    });

    this.directionsRenderer.setMap(this.map);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setInitialMap();
  }



}
