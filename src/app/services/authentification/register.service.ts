import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { map} from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../../models/authentification/user';
import { UserRegistrationModel } from '../../models/authentification/UserRegistrationModel';
import { UserRegSocial } from '../../models/authentification/userRegSocial';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private userSubject: BehaviorSubject<User>;
  constructor( private router: Router,
               private http: HttpClient, ) {
      this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
     }

    registerSocial(model: UserRegSocial): Observable<User> {
      return this.http.post<any>(`${environment.API_URL}/register/social`, model)
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
    }
    register(registrationModel: UserRegistrationModel): Observable<any>  {
      return this.http.post<any>(`${environment.API_URL}/register`, registrationModel)
        .pipe(map(user => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        }));
    }

    // tslint:disable-next-line:typedef
     getAdresse(value){
        const params = new HttpParams()
            .set('q', value)
            .set('autocomplete', String(1))
            .set('limit', String(15));
        return  this.http.get<any>(`${environment.ADRESSE_API}/search`, {params});
    }
}
