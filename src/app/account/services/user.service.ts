import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(  private http: HttpClient) { }

  // tslint:disable-next-line:typedef
  getById() {
    return this.http.get<any>(`${environment.API_URL}/me`);
  }
  // tslint:disable-next-line:typedef
  deleteAccount() {
    return this.http.delete(`${environment.API_URL}/me/delete`);
  }
  // tslint:disable-next-line:typedef
  updateAccount(user: any) {
    return this.http.put(`${environment.API_URL}/me/updateInfos`, user);
  }
  // tslint:disable-next-line:typedef
  resetPassword(body) {
    return this.http.post(`${environment.API_URL}/auth/resetPassword`, body);
  }
  // tslint:disable-next-line:typedef
  confirmeEmail(token) {
    const params = new HttpParams().set('t', token);
    return this.http.get<any>(`${environment.API_URL}/account/confirmEmail`, {params});
  }
  // tslint:disable-next-line:typedef
  sendConfirmeEmail(){
    return this.http.post<any>(`${environment.API_URL}/account/confirmEmail/send`, {});
  }
}
