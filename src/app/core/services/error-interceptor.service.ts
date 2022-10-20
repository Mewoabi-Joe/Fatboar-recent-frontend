import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthService} from './auth.service';
import {ErrordialogService} from './errordialog.service';
import {NotificationService} from './notification.service';
@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(private authenticationService: AuthService, private errorDialog: ErrordialogService,
              private notification: NotificationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([400].indexOf(err.status) !== -1) {
        const msg = err.error.message.toString() || err.statusText.toString();
        this.notification.openSnackBar(msg, null);
      }
      if ([403].includes(err.status)) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        this.authenticationService.logout();
      }
      if ([401].includes(err.status) && this.authenticationService.userValue) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        this.authenticationService.refreshToken().subscribe({
            error: e => {
            this.authenticationService.logout();
            return throwError(e);
          }
        });

      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
