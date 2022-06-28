import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user/user.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {ImageService} from "../services/image/image.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  username: string | undefined;
  profileImage: any;

  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private router: Router,
    private sanitizer: DomSanitizer) { }

  public goToOffersPage(category: string): void {
    this.router.navigate(['offers'], {
      queryParams: {'category': category}
    });
  }

  public getCurrentUser(): void{
    this.userService.getUsername().subscribe(
      (response: string) => {
        this.username = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getProfileImage() {
    if (!localStorage.getItem('profile-image')) {
      this.imageService.getProfileImageForLoggedInUser().subscribe(
        (response: string) => {
          this.profileImage = response;
          localStorage.setItem('profile-image', response);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    } else {
      this.profileImage = localStorage.getItem('profile-image');
    }
  }

  public getSanitizerUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public goToAddOfferPage(): void {
    if (this.userService.checkIfUserIsLoggedIn()){
      this.router.navigateByUrl('offer/add');
    } else {
      this.goToAuthenticationPage();
    }
  }

  public goToHomePage(): void{
    this.router.navigateByUrl('/home');
  }

  public goToAuthenticationPage(): void{
    this.router.navigateByUrl('/authenticate');
  }

  public goToAccountDashboard(): void {
    this.router.navigate(['account'], {
      queryParams: {'section': 'my-account'},
    });
  }

  public goToRecommendedOffersPage(): void {
    let queryParams = {
      category: 'lodging' // default category
    }
    this.router.navigate(['offers/recommendations'], {queryParams});
  }

  public logout(): void{
    localStorage.removeItem('token');
    localStorage.removeItem('profile-image');
    if (
      this.router.url.includes('/account') ||
      this.router.url === '/offer/add' ||
      this.router.url.split('?')[0] === '/offer/lodging/edit' ||
      this.router.url.split('?')[0] === '/offer/food/edit' ||
      this.router.url.split('?')[0] === '/offer/attraction/edit' ||
      this.router.url.split('?')[0] === '/offer/activity/edit'){
      this.router.navigateByUrl('/home');
    } else {
      window.location.reload();
    }
  }

  ngOnInit(): void {
    if (this.userService.checkIfUserIsLoggedIn()) {
      this.getCurrentUser();
      this.getProfileImage();
    }
  }

}
