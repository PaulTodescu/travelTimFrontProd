import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../services/user/user.service";
import {UserDTO} from "../../entities/userDTO";
import {relative} from "@angular/compiler-cli/src/ngtsc/file_system";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  selectedOption: string | undefined;
  loggedInUser: UserDTO | undefined;

  constructor(
    private router: Router,
    private userService: UserService,
    private activatedRout: ActivatedRoute) {
    this.activatedRout.queryParams.subscribe(
      data => {
        this.selectedOption = data.section;
      });
  }

  public switchSelectedOption(selectedOption: string): void {
    let queryParams: Params;
    if (selectedOption === 'offers'){
      queryParams = {
        section: 'offers',
        category: 'lodging' // default category
      }
    } else {
      queryParams = {
        section: selectedOption
      }
    }
    this.router.navigate([], {queryParams});
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
