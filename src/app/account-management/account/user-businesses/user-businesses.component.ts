import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddBusinessComponent} from "../../../business/add-business/add-business.component";
import {UserService} from "../../../services/user/user.service";
import {Business} from "../../../entities/business";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {BusinessService} from "../../../services/business/business.service";
import {BusinessDetailsComponent} from "../../../business/business-details/business-details.component";
import {EditBusinessComponent} from "../../../business/edit-business/edit-business.component";
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-user-businesses',
  templateUrl: './user-businesses.component.html',
  styleUrls: ['./user-businesses.component.scss'],
})
export class UserBusinessesComponent implements OnInit {

  businesses: Business[] | undefined;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private businessService: BusinessService) { }

  private getBusinessesForCurrentUser() {
    this.userService.getBusinessesForCurrentUser().subscribe(
      (response: Business[]) => {
        this.businesses = response;
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

  public openBusinessDetailsModal(businessId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'dialog-class' // in styles.css
    dialogConfig.data = {businessId: businessId};
    this.dialog.open(BusinessDetailsComponent, dialogConfig);
  }

  public openEditBusinessModal(businessId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'dialog-class' // in styles.css
    dialogConfig.disableClose = true;
    dialogConfig.data = {businessId: businessId};
    this.dialog.open(EditBusinessComponent, dialogConfig);
    this.dialog._getAfterAllClosed().subscribe(() => {
      this.getBusinessesForCurrentUser();
    });
  }

  public openDeleteBusinessDialog(businessId: number, businessName: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete business: ' + businessName,
      icon: 'warning',
      showCancelButton: true,
      focusConfirm: true,
      confirmButtonColor: '#c73c3c',
      cancelButtonColor: '#696969',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteBusiness(businessId);
      }
    })
  }

  public deleteBusiness(businessId: number): void {
    Swal.fire({
      title: 'Please Wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });
    this.businessService.deleteBusiness(businessId).subscribe(
      () => {
        this.onDeleteBusinessSuccess();
        this.getBusinessesForCurrentUser();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        this.onDeleteBusinessFail();
      }
    )
  }


  public onDeleteBusinessSuccess(): void {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Business Deleted!',
      showConfirmButton: false,
      timer: 2200,
    }).then(function(){})
  }

  public onDeleteBusinessFail(): void {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Something went wrong. Please try again later.',
      showConfirmButton: false,
      timer: 2500
    }).then(function(){})
  }

  public downloadBusinessesCsv(): void {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: '',
      useBom: true,
      noDownload: false,
      headers: ["Name", "Address", "City", "Email", "Phone Number"]
    };

    if (this.businesses !== undefined) {
      let csvData = [];
      for (let i = 0; i < this.businesses.length; i++) {
        let business: Business = this.businesses[i];
        if (!business.email){
          business.email = 'Not Provided';
        }
        if (!business.phoneNumber){
          business.phoneNumber = 'Not Provided';
        }
        let entry = {
          "Name": business.name,
          "Address": business.address,
          "City": business.city,
          "Email": business.email,
          "Phone Number": business.phoneNumber
        };
        csvData.push(entry);
      }
      let today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      const yyyy = today.getFullYear();

      let title = 'TravelTim-Businesses-' + dd + '-' + mm + '-' + yyyy;

      new ngxCsv(csvData, title, options);

    }
  }

  ngOnInit(): void {
    this.getBusinessesForCurrentUser();
  }

}
