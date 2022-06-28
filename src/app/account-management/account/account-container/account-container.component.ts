import {Component, Injector, OnInit} from '@angular/core';
import {UserService} from "../../../services/user/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {ImageService} from "../../../services/image/image.service";

@Component({
  selector: 'app-account-container',
  templateUrl: './account-container.component.html',
  styleUrls: ['./account-container.component.scss']
})
export class AccountContainerComponent implements OnInit {

  profileImage: File | undefined;
  profileImageLink: string | undefined;

  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private injector: Injector) { }


  public getProfileImage(): void {
    this.imageService.getProfileImageForLoggedInUser().subscribe(
      (response: string) => {
        this.profileImageLink = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public uploadFile(event: Event): void {
    this.profileImage = undefined;
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.profileImage = fileList[0];
      this.imageService.uploadProfileImage(this.profileImage).subscribe(
        () => {
          localStorage.removeItem('profile-image');
          window.location.reload();
        },
        (error: HttpErrorResponse) => {
          alert(error.message)
        }
      )
    }
  }

  public openDeleteAccountConfirmationDialog(): void{
    Swal.fire({
      title: 'Are you sure?',
      text: 'All information associated with your account will be lost',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c73c3c',
      cancelButtonColor: '#696969',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser();
      }
    })
  }

  public deleteUser(): void {
    Swal.fire({
      title: 'Please Wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });
    this.userService.deleteLoggedInUser().subscribe(
      () => {
        let router: Router = this.injector.get(Router);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Account Deleted!',
          text: 'You will be redirected to home',
          showConfirmButton: false,
          timer: 2500
        }).then(function(){
          localStorage.removeItem('token');
          localStorage.removeItem('profile-image');
          router.navigateByUrl('home');
        })

      },
      (error: HttpErrorResponse) => {
        console.log(error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Something went wrong. Try again later.',
          showConfirmButton: false,
          timer: 2500
        }).then(function(){
        })
      }
    )
  }


  ngOnInit(): void {
    this.getProfileImage();
  }

}
