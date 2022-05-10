import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImageService} from "../../services/image/image.service";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-edit-offer-images',
  templateUrl: './edit-offer-images.component.html',
  styleUrls: ['./edit-offer-images.component.scss']
})
export class EditOfferImagesComponent implements OnInit {

  @Input() offerId: number | undefined;
  @Input() offerCategory: string | undefined;

  images : string[] = [];
  imageFiles: File[] = [];
  imageFilesNames: string[] = [];

  constructor(
    private imageService: ImageService,
    private sanitizer: DomSanitizer) {}

  @Output() imagesEvent: EventEmitter<File[]> = new EventEmitter<File[]>();

  public getOfferImages(): void {
    if (this.offerId !== undefined && this.offerCategory !== undefined)
    this.imageService.getOfferImages(this.offerId, this.offerCategory).subscribe(
      (response: string[]) => {
        this.images = response;
        this.getImageFiles();
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public convertBase64ImageUrlToFile(url: string, name: string, mimeType: string): any{
    return (fetch(url)
        .then(function (res){return res.arrayBuffer();})
        .then(function (buf){return new File([buf], name, {type: mimeType})})
    )
  }

  public getImageFiles(): void {
    for (let i=0; i < this.images.length; i++){
      let mimeType = this.images[i].substring(0, this.images[i].indexOf(';'))
      this.convertBase64ImageUrlToFile(this.images[i], this.imageFilesNames[i], mimeType)
        .then((file: File) => {
          this.imageFiles.push(file);
          this.imagesEvent.emit(this.imageFiles);
        })
    }
  }

  public getSanitizerUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public getOfferImagesNames(): void {
    if (this.offerId !== undefined && this.offerCategory !== undefined) {
      this.imageService.getOfferImagesNames(this.offerId, this.offerCategory).subscribe(
        (response: string[]) => {
          this.imageFilesNames = response;
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public uploadImages(event: any): void {
    if (event.target.files && event.target.files[0]) {
      let numberImages = event.target.files.length + this.images.length;
      if (numberImages > 10){
        this.onFail("Cannot add more than 10 images");
        return;
      }
      for (let i = 0; i < numberImages; i++) {
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.images.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
        this.imageFiles.push(event.target.files[i]);
        this.imagesEvent.emit(this.imageFiles);
      }
    }
  }

  public deleteImage(imageIndex: number): void {
    this.images.splice(imageIndex,1);
    this.imageFiles.splice(imageIndex, 1);
    this.imagesEvent.emit(this.imageFiles);
  }

  public onFail(message: string): void{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 2500
    }).then(function(){})
  }

  ngOnInit(): void {
    this.getOfferImagesNames();
    this.getOfferImages();
  }

}
