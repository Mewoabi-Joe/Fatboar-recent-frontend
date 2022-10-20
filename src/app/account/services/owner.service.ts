import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  constructor( private http: HttpClient) { }
  addOwnerToAccount(username: string): Observable<any> {
    return this.http.post(`${environment.API_URL}/owner/addOwner`, {username});
  }

  deleteOwner(): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/owner/deleteOwner`);
  }
}
