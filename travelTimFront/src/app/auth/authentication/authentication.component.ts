import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  flag: boolean = true

  constructor() { }

  switchBetweenLoginRegister(option:string){
    this.flag = option == 'login';
  }

  ngOnInit(): void {
  }

}
