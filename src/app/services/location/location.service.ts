import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Location} from "../../entities/Location";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl = 'https://traveltimback.herokuapp.com/';

  constructor(private http: HttpClient) { }

  public getCities(): Observable<string[]>{
    return this.http.get<string[]>(`${this.apiUrl}/location/cities`)
  }

  public addVisitedLocation(location: Location): Observable<Location>{
    return this.http.post<Location>(`${this.apiUrl}/location/visited/user`, location);
  }

  public getVisitedLocationsForUser(): Observable<Location[]>{
    return this.http.get<Location[]>(`${this.apiUrl}/location/visited/user`)
  }

  public removeVisitedLocationForUser(locationId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/location/visited/${locationId}/user`);
  }

}
