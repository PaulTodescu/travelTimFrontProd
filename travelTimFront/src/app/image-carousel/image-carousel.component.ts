import {Component} from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent{

  images = [
    "../../assets/img/tim-img-1.png",
    "../../assets/img/tim-img-2.png",
    "../../assets/img/tim-img-3.png",
    "../../assets/img/tim-img-4.png",
    "../../assets/img/tim-img-5.png"
  ];

}
