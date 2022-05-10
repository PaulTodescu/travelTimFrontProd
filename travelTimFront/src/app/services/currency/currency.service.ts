import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public getCurrencyConversionRate(fromCode: string, toCode: string): Observable<number>{
    let params = {fromCode: fromCode, toCode: toCode}
    return this.http.get<number>(`${this.apiUrl}/currency/conversion/rate`, {params: params});
  }

}
