import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-add-offer-images-section',
  templateUrl: './add-offer-images-section.html',
  styleUrls: ['./add-offer-images-section.scss']
})
export class AddOfferImagesSection implements OnInit {

  images : string[] = [];
  imageFiles: File[] = [];

  constructor() { }

  @Output() imagesEvent: EventEmitter<File[]> = new EventEmitter<File[]>();

  public uploadImages(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.images = [];
      this.imageFiles = [];
      let numberImages = event.target.files.length;
      if (numberImages > 10){
        numberImages = 10;
      }
      for (let i = 0; i < numberImages; i++) {
        let reader = new FileReader();
        reader.onload = (event:any) => {
          this.images.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
        this.imageFiles.push(event.target.files[i]);
      }
      this.imagesEvent.emit(this.imageFiles);
    }
  }

  public deleteImage(imageIndex: number): void {
    this.images.splice(imageIndex,1);
    this.imageFiles.splice(imageIndex, 1);
    this.imagesEvent.emit(this.imageFiles);
  }

  ngOnInit(): void {
  }

}
