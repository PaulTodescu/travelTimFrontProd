import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../entities/user";
import { Observable } from 'rxjs';
import {AuthenticationRequest} from "../../entities/authenticationRequest";
import {AuthenticationResponse} from "../../entities/AuthenticationResponse";
import {UserDTO} from "../../entities/userDTO";
import { JwtHelperService } from "@auth0/angular-jwt"
import {Business} from "../../entities/business";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService) { }

  public registerUser(user: User): Observable<void>{
    return this.http.post<void>(`${this.apiUrl}/user/register`, user);
  }

  public loginUser(authenticationRequest: AuthenticationRequest): Observable<AuthenticationResponse>{
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/authenticate`, authenticationRequest);
  }

  public getUsername(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/user/name`, { responseType: 'text' as 'json'});
  }

  public getUsernameByEmail(email: string){
    return this.http.get<any>(`${this.apiUrl}/user?email=${email}`, { responseType: 'text' as 'json'});
  }

  public getLoggedInUser(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/user/info`);
  }

  public editUser(user: UserDTO): Observable<UserDTO>{
    return this.http.put<UserDTO>(`${this.apiUrl}/user`, user);
  }

  public editUserPhoneNumber(phoneNumber: string){
    return this.http.patch<any>(`${this.apiUrl}/user/phone`, phoneNumber);
  }

  public checkIfUserIsLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    // @ts-ignore
    if (this.jwtHelper.isTokenExpired(token)){
      localStorage.removeItem('token');
    }
    // @ts-ignore
    return !this.jwtHelper.isTokenExpired(token);

  }

  public deleteLoggedInUser(): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/user`);
  }

  public getBusinessesForCurrentUser(): Observable<Business[]>{
    return this.http.get<Business[]>(`${this.apiUrl}/user/businesses`);
  }
}
