import { Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { map} from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';
import {SocialAuthService} from 'angularx-social-login';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: SocialAuthService,
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }
  public  setUserValue(model: User): void {
    this.userSubject.next(model);
 }
    private extractLogin(res): User {
        const userModel: User = {id: res.data.user.id, username: res.data.user.username,
            email: res.data.user.email, type: res.data.user.type,
            authExpiration: res.data.authExpiration, token: res.data.authToken,
            refreshToken: res.data.refreshToken , refreshExpiration: res.data.refreshExpiration

        };
        localStorage.setItem('user', JSON.stringify(userModel));

        this.userSubject.next(userModel);
        return userModel;
    }
   login(identifier: string, password: string): Observable<User> {
    return this.http.post<any>(`${environment.API_URL}/auth/login`, { identifier, password })
      .pipe(map(res => {
          return this.extractLogin(res);
      }));
  }
  refreshToken(): Observable<User>  {
    const body = {
      refreshToken: this.userValue.refreshToken
    };
    return this.http.post(`${environment.API_URL}/auth/refreshToken`, body).pipe(map(res => {
      return this.extractLogin(res);
  }));
  }


  loginSocial(email: string, fullName: string, provider: string): Observable<User> {
    return this.http.post<any>(`${environment.API_URL}/auth/loginSocial`, { email, fullName, provider })
      .pipe(map(res => {
          return this.extractLogin(res);

      }));
  }

  verifyUserName(username: string): Observable<{ isUserNameAvailable: boolean }> {
   return  this.http.get<any>(`${environment.API_URL}/register/verifyUsername/${username}`).pipe(map(res => {
       return res && !res.isExist ? null : { isUserNameAvailable: true};
    }));
  }
  verifyEmail(email: string): Observable<{ isEmailAvailable: boolean }> {
   return  this.http.get<any>(`${environment.API_URL}/register/verifyEmail/${email}`).pipe(map(res => {
       return res && !res.isExist ? null : { isEmailAvailable: true };
    }));
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('restaurentId');
    this.userSubject.next(null);
    this.authService.signOut().catch(() => {
    });
    this.router.navigate(['/auth']);
  }
  logoutWithoutRedirect(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('restaurentId');
    this.userSubject.next(null);
    this.authService.signOut().catch(() => {
    });
  }
    requestResetPassword(query): Observable<any>{
        const params = new HttpParams()
            .set('email', query);
        return  this.http.get<any>(`${environment.API_URL}/auth/requestResetPassword`, {params});
    }
}
