import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PhysicalPersonLodgingOffer} from "../../entities/physicalPersonLodgingOffer";
import {LegalPersonLodgingOffer} from "../../entities/legalPersonLodgingOffer";
import {LodgingUtility} from "../../entities/lodgingUtility";
import {LegalPersonLodgingOfferBaseDetailsDTO} from "../../entities/legalPersonLodgingOfferBaseDetailsDTO";
import {PhysicalPersonLodgingOfferEditDTO} from "../../entities/physicalPersonLodgingOfferEditDTO";
import {LegalPersonLodgingOfferEditDTO} from "../../entities/legalPersonLodgingOfferEditDTO";
import {OfferContact} from "../../entities/offerContact";
import {PhysicalPersonLodgingOfferDetails} from "../../entities/physicalPersonLodgingOfferDetails";
import {LodgingOfferDetailsDTO} from "../../entities/lodgingOfferDetailsDTO";
import {DaySchedule} from "../../entities/daySchedule";

@Injectable({
  providedIn: 'root'
})
export class LodgingService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public addPhysicalPersonLodgingOffer(lodgingOffer: PhysicalPersonLodgingOffer): Observable<number>{
    return this.http.post<number>(`${this.apiUrl}/lodging/physical`, lodgingOffer);
  }

  public addLegalPersonLodgingOffer(lodgingOffer: LegalPersonLodgingOffer): Observable<number>{
    return this.http.post<number>(`${this.apiUrl}/lodging/legal`, lodgingOffer);
  }

  public addLodgingUtilities(lodgingOfferId: number, lodgingOfferServices: LodgingUtility[]): Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/lodging/${lodgingOfferId}/utilities`, lodgingOfferServices);
  }

  public getPhysicalLodgingOfferById(offerId: number): Observable<PhysicalPersonLodgingOfferDetails>{
    return this.http.get<PhysicalPersonLodgingOfferDetails>(`${this.apiUrl}/lodging/physical/${offerId}`);
  }

  public getLegalLodgingOfferById(offerId: number): Observable<LegalPersonLodgingOfferBaseDetailsDTO>{
    return this.http.get<LegalPersonLodgingOfferBaseDetailsDTO>(`${this.apiUrl}/lodging/legal/${offerId}`);
  }

  public getLodgingOfferDetails(offerId: number): Observable<LodgingOfferDetailsDTO>{
    return this.http.get<LodgingOfferDetailsDTO>(`${this.apiUrl}/lodging/${offerId}/details`);
  }

  public deleteLodgingOffer(offerId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/lodging/${offerId}`);
  }

  public getLegalPersonLodgingOfferForEdit(offerId: number): Observable<LegalPersonLodgingOfferEditDTO>{
    return this.http.get<LegalPersonLodgingOfferEditDTO>(`${this.apiUrl}/lodging/legal/edit/get/${offerId}`);
  }

  public getBusinessScheduleForLegalLodgingOffer(offerId: number): Observable<DaySchedule[]>{
    return this.http.get<DaySchedule[]>(`${this.apiUrl}/lodging/legal/${offerId}/business/schedule`);
  }

  public getPhysicalPersonLodgingOfferForEdit(offerId: number): Observable<PhysicalPersonLodgingOfferEditDTO>{
    return this.http.get<PhysicalPersonLodgingOfferEditDTO>(`${this.apiUrl}/lodging/physical/edit/get/${offerId}`);
  }

  public editLegalPersonLodgingOffer(offer: LegalPersonLodgingOfferEditDTO, offerId: number){
    return this.http.put<void>(`${this.apiUrl}/lodging/legal/${offerId}`, offer);
  }

  public editPhysicalPersonLodgingOffer(offer: PhysicalPersonLodgingOfferEditDTO, offerId: number){
    return this.http.put<void>(`${this.apiUrl}/lodging/physical/${offerId}`, offer);
  }

  public addContactDetails(offerId: number, contactDetails: OfferContact){
    return this.http.put<void>(`${this.apiUrl}/lodging/${offerId}/contact/add`, contactDetails);
  }

  public editContactDetails(offerId: number, contactDetails: OfferContact){
    return this.http.put<void>(`${this.apiUrl}/lodging/${offerId}/contact/edit`, contactDetails);
  }

  public getContactDetails(offerId: number): Observable<OfferContact>{
    return this.http.get<OfferContact>(`${this.apiUrl}/lodging/${offerId}/contact`);
  }

}
