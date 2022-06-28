import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {LodgingUtility} from "../../entities/lodgingUtility";
import {ImageService} from "../../services/image/image.service";
import {DomSanitizer} from "@angular/platform-browser";
import {OfferContact} from "../../entities/offerContact";
import {HttpErrorResponse} from "@angular/common/http";
import {ContactService} from "../../services/contact/contact.service";


@Component({
  selector: 'app-legal-lodging-offer-details',
  templateUrl: './legal-lodging-offer-details.component.html',
  styleUrls: ['./legal-lodging-offer-details.component.scss']
})
export class LegalLodgingOfferDetailsComponent implements OnInit {

  constructor(
    private imageService: ImageService,
    private contactService: ContactService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: {
      id: number,
      description: string;
      utilities: LodgingUtility[],
      offerContact: OfferContact
    }) {
    this.getOfferContact();
  }

  images: string[] = [];
  imageObjects: Array<object> = new Array<object>();
  selectedImage: string = this.images[0];
  selectedImageIndex: number = -1;
  showImageModalFlag: boolean = false;

  offerContact: OfferContact | undefined;

  public getOfferImages(){
    if (this.data.id !== undefined) {
      this.imageService.getOfferImages(this.data.id, 'lodging').subscribe(
        (response: string[]) => {
          this.images = response;
          this.mapImageObjects();
          this.selectedImage = response[0];
        }
      )
    }
  }

  public getOfferContact(): void {
    if (this.data.id) {
      this.contactService.getContactDetails(this.data.id, 'lodging').subscribe(
        (response: OfferContact) => {
          this.offerContact = response;
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }


  public getSanitizerUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public mapImageObjects(){
    this.imageObjects = this.images.map((image) => ({image: image, alt: '...'}));
  }

  setImage(image: string) {
    this.selectedImage = image;
  }

  public showImageModal(selectedImage: string): void {
    this.selectedImageIndex = this.images.indexOf(selectedImage);
    this.showImageModalFlag = true;
  }

  public closeImageModal() {
    this.showImageModalFlag = false;
    this.selectedImageIndex = -1;
  }

  ngOnInit(): void {
    this.getOfferImages();
  }

}
