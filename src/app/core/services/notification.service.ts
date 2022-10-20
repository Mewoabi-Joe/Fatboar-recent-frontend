import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotificationComponent} from '../notification/notification.component';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar){ }
  openSnackBar(message: string, action: string): void  {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }
  openSnackBarComponent(data): void {
    this.snackBar.openFromComponent(NotificationComponent, {
      data,
      duration: 4000,
    });
  }


}
