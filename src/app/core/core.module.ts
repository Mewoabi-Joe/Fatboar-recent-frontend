import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatrielLoaderModule} from '../matriel-loader';
import { NavComponent } from './nav/nav.component';
import { FontAwesomeModule  } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import {TranslateModule} from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { NotificationService } from './services/notification.service';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import { ErrordialogService } from './services/errordialog.service';
import { NotificationComponent } from './notification/notification.component';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {AuthGuardService} from './services/auth-guard.service';
import {AuthService} from './services/auth.service';
import { LazyImageComponent } from './lazy-image/lazy-image.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [NavComponent, FooterComponent, ErrorDialogComponent, MatConfirmDialogComponent, NotificationComponent, LazyImageComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatrielLoaderModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        FontAwesomeModule,
        HttpClientModule,
        TranslateModule,
        MDBBootstrapModule

    ], providers: [ { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    NotificationService, ErrordialogService,
    AuthGuardService, AuthService,
  ],
  exports: [CommonModule,
    MatrielLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule,
    FontAwesomeModule,
    NavComponent,
    HttpClientModule,
    TranslateModule, FooterComponent, LazyImageComponent],
  entryComponents: [MatConfirmDialogComponent, ErrorDialogComponent]
})
export class CoreModule { }
