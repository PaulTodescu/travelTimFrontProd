import {Component, Injector, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {FormBuilder, FormGroup} from "@angular/forms";
import { UserService } from 'src/app/services/user/user.service';
import {AuthenticationResponse} from "../../entities/AuthenticationResponse";
import {Location} from "@angular/common";
import {ImageService} from "../../services/image/image.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  hidePassword: boolean = true;
  wrongCredentialsError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private imageService: ImageService,
    private injector: Injector) { }

  public login(loginForm: FormGroup): void{
    this.userService.loginUser(loginForm.value).subscribe(
      (authenticationResponse: AuthenticationResponse) => {
        localStorage.setItem('token',authenticationResponse.jwt);
        var email = this.loginForm.get('email')?.value;
        this.userService.getUsernameByEmail(email).subscribe(
          (usernameResponse) => {
            this.wrongCredentialsError = false;
            this.onSuccess(usernameResponse);
          }
        )

      }, () => {
        this.wrongCredentialsError = true;
      }
    );
  }

  public onSuccess(username: string): void{
    let location: Location = this.injector.get(Location);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Hello ' + username,
      showConfirmButton: false,
      timer: 2000
    }).then(function(){
      location.back();
    })
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:[''],
      password:['']
    })
  }

}
