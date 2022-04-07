import {Component, Inject, OnInit} from '@angular/core';
import {Business} from "../../../entities/business";
import {FormBuilder, FormGroup} from "@angular/forms";
import {BusinessService} from "../../../services/business/business.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.scss']
})
export class BusinessDetailsComponent implements OnInit {

  businessToDisplay: Business | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private businessService: BusinessService,
    @Inject(MAT_DIALOG_DATA) public data: { businessId: number }) { }

  businessDetailsForm: FormGroup = this.formBuilder.group({
    name: [],
    city: [],
    address: [],
    cui: [],
  })

  private getBusinessToDisplay(businessId: number): void {
    this.businessService.getBusinessById(businessId).subscribe(
      (response: Business) => {
        this.businessToDisplay = response;
        this.setValues(response);
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    )
  }

  private setValues(business: Business): void {
    this.businessDetailsForm.patchValue({
      name: business.name,
      city: business.city,
      address: business.address,
      cui: business.cui
    })
  }

  ngOnInit(): void {
    this.getBusinessToDisplay(this.data.businessId);
    this.businessDetailsForm.disable();
  }

}
