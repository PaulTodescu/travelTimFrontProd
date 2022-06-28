import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../entities/user";
import { Observable } from 'rxjs';
import {AuthenticationRequest} from "../../entities/authenticationRequest";
import {AuthenticationResponse} from "../../entities/AuthenticationResponse";
import {UserDTO} from "../../entities/userDTO";
import { JwtHelperService } from "@auth0/angular-jwt"
import {Business} from "../../entities/business";
import {LodgingOfferBaseDetailsDTO} from "../../entities/LodgingOfferBaseDetailsDTO";
import {FoodOfferBaseDetailsDTO} from "../../entities/FoodOfferBaseDetailsDTO";
import {AttractionOfferBaseDetailsDTO} from "../../entities/attractionOfferBaseDetailsDTO";
import {ActivityOfferBaseDetailsDTO} from "../../entities/activityOfferBaseDetailsDTO";
import {PhysicalPersonLodgingOfferDTO} from "../../entities/physicalPersonLodgingOfferDTO";
import {AttractionOfferForBusinessDTO} from "../../entities/attractionOfferForBusinessDTO";
import {ActivityOfferForBusinessPageDTO} from "../../entities/activityOfferForBusinessPageDTO";

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

  public getUserDetailsById(userId: number): Observable<UserDTO>{
    return this.http.get<UserDTO>(`${this.apiUrl}/user/${userId}/details`);
  }

  public getLoggedInUserId(): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/user/id`, { responseType: 'text' as 'json'});
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

  public getLodgingOffers(): Observable<LodgingOfferBaseDetailsDTO[]>{
    return this.http.get<LodgingOfferBaseDetailsDTO[]>(`${this.apiUrl}/user/offers/lodging`);
  }

  public getFoodOffers(): Observable<FoodOfferBaseDetailsDTO[]>{
    return this.http.get<FoodOfferBaseDetailsDTO[]>(`${this.apiUrl}/user/offers/food`);
  }

  public getAttractionOffers(): Observable<AttractionOfferBaseDetailsDTO[]>{
    return this.http.get<AttractionOfferBaseDetailsDTO[]>(`${this.apiUrl}/user/offers/attraction`);
  }

  public getLodgingOffersForUserPage(userId: number): Observable<PhysicalPersonLodgingOfferDTO[]>{
    return this.http.get<PhysicalPersonLodgingOfferDTO[]>(`${this.apiUrl}/user/${userId}/offers/lodging`);
  }

  public getActivityOffers(): Observable<ActivityOfferBaseDetailsDTO[]>{
    return this.http.get<ActivityOfferBaseDetailsDTO[]>(`${this.apiUrl}/user/offers/activity`);
  }

  public getAttractionOffersForUserPage(userId: number): Observable<AttractionOfferForBusinessDTO[]>{
    return this.http.get<AttractionOfferForBusinessDTO[]>(
      `${this.apiUrl}/user/${userId}/offers/attractions`);
  }

  public getActivityOffersForUserPage(userId: number): Observable<ActivityOfferForBusinessPageDTO[]>{
    return this.http.get<ActivityOfferForBusinessPageDTO[]>(
      `${this.apiUrl}/user/${userId}/offers/activities`);
  }

}
