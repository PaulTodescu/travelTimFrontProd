import {Component, Input, OnInit} from '@angular/core';
import {ImageService} from "../../services/image/image.service";
import {HttpErrorResponse} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-food-offer-business-images',
  templateUrl: './food-offer-business-images.component.html',
  styleUrls: ['./food-offer-business-images.component.scss']
})
export class FoodOfferBusinessImagesComponent implements OnInit {

  @Input() businessId: number | undefined;
  images: string[] = [];
  imageObjects: Array<object> = new Array<object>();
  selectedImageIndex: number = -1;
  showImageModalFlag: boolean = false;

  constructor(
    private imageService: ImageService,
    private sanitizer: DomSanitizer) {}

  public getImages(): void {
    if (this.businessId !== undefined) {
      this.imageService.getBusinessImages(this.businessId).subscribe(
        (response: string[]) => {
          this.images = response;
          this.mapImageObjects();
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

  public showImageModal(selectedImage: string): void {
    this.selectedImageIndex = this.images.indexOf(selectedImage);
    this.showImageModalFlag = true;
  }

  public closeImageModal() {
    this.showImageModalFlag = false;
    this.selectedImageIndex = -1;
  }


  ngOnInit(): void {
    this.getImages();
  }
}
