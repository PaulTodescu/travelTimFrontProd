import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../services/user/user.service";
import {UserDTO} from "../../entities/userDTO";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  selectedOption: string = 'account';
  loggedInUser: UserDTO | undefined;

  constructor(
    private router: Router,
    private userService: UserService) { }

  public switchSelectedOption(option: string): void {
    this.selectedOption = option;
  }

  public getCurrentUser(): void{
    this.userService.getLoggedInUser().subscribe(
      (response: UserDTO) => {
        this.loggedInUser = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public logout(): void{
    localStorage.removeItem('token');
    this.router.navigateByUrl('home');
  }

  ngOnInit(): void {
    this.getCurrentUser()
  }

}
