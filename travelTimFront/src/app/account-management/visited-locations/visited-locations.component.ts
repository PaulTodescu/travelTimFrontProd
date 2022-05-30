import {Component, OnInit, ViewChild} from '@angular/core';
import {MapComponent} from "../../map/map.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddVisitedLocationDialogComponent} from "./add-visited-location-dialog/add-visited-location-dialog.component";
import {LocationService} from "../../services/location/location.service";
import Swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {Location} from "../../entities/Location";

@Component({
  selector: 'app-visited-locations',
  templateUrl: './visited-locations.component.html',
  styleUrls: ['./visited-locations.component.scss']
})
export class VisitedLocationsComponent implements OnInit {

  visitedLocations: Location[] = [];

  @ViewChild(MapComponent) mapComponent: any;

  noVisitedLocations: boolean = false;
  showLoadingSpinner: boolean = true;

  constructor(
    private locationService: LocationService,
    private dialog: MatDialog) { }

  public getVisitedLocations(): void {
    this.locationService.getVisitedLocationsForUser().subscribe(
      (response: Location[]) => {
        this.visitedLocations = response;
        this.showLoadingSpinner = false;
        if (response.length == 0) {
          this.noVisitedLocations = true;
        }
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public openAddLocationDialog(): void {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = "40%";
      const dialogRef = this.dialog.open(AddVisitedLocationDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(res => {
        if (res.newVisitedLocation) {
          this.locationService.addVisitedLocation(res.newVisitedLocation).subscribe(
            (response: Location) => {
              this.visitedLocations.push(response);
              this.noVisitedLocations = false;
              this.onSuccess('Location added successfully');
            }, (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        }
      });
  }

  public removeVisitedLocation(locationIndex: number): void {
    let locationId = this.visitedLocations[locationIndex].id;
    if (locationId) {
      this.locationService.removeVisitedLocationForUser(locationId).subscribe(
        () => {
          this.visitedLocations.splice(locationIndex, 1);
          if (this.visitedLocations.length === 0) {
            this.noVisitedLocations = true;
          }
          this.onSuccess('Location removed');
        }
      )
    }
  }

  public setMarkerOnMap(locationIndex: number): void {
    let location = this.visitedLocations[locationIndex]
    this.mapComponent.setMarker(location.address + ', ' + location.city);
  }

  public onSuccess(message: string): void{
    Swal.fire({
      toast: true,
      position: 'bottom-left',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      showCancelButton: false,
      timer: 2200
    }).then(function(){});
  }

  ngOnInit(): void {
    this.getVisitedLocations();
  }

}
