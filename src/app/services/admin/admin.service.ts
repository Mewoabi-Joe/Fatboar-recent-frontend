import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(  private http: HttpClient) {

  }
  getWinner(): Observable<any> {
    return  this.http.get<any>(`${environment.API_URL}/admin/winner`);
  }
   getTicketNumber(): Observable<any> {
    return  this.http.get<any>(`${environment.API_URL}/games`);
  }
}
