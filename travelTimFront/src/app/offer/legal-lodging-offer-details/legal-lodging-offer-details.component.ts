import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {LodgingUtility} from "../../entities/lodgingUtility";
import {ImageService} from "../../services/image/image.service";


@Component({
  selector: 'app-legal-lodging-offer-details',
  templateUrl: './legal-lodging-offer-details.component.html',
  styleUrls: ['./legal-lodging-offer-details.component.scss']
})
export class LegalLodgingOfferDetailsComponent implements OnInit {

  constructor(
    private imageService: ImageService,
    @Inject(MAT_DIALOG_DATA) public data: {
      id: number,
      description: string;
      utilities: LodgingUtility[]
    }) { }

  images: string[] = [];

  imageObjects: Array<object> = new Array<object>();

  selectedImage: string = this.images[0];

  selectedImageIndex: number = -1;
  showImageModalFlag: boolean = false

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
