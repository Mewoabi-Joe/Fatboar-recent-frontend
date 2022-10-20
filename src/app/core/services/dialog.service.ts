import { Injectable } from '@angular/core';
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class DialogService {
    constructor(private dialog: MatDialog) { }
    openConfirmDialog(msg, dialogBtn): MatDialogRef<MatConfirmDialogComponent, any> {
        return this.dialog.open(MatConfirmDialogComponent, {
            width: '390px',
            panelClass: 'confirm-dialog-container',
            disableClose: true,
            position: { top: '10px' },
            data: {
                message: msg,
                btn: dialogBtn
            }
        });
    }
    openConfirmDialogLegal(msg, dialogBtn, show): MatDialogRef<MatConfirmDialogComponent, any> {
        return this.dialog.open(MatConfirmDialogComponent, {
            width: '390px',
            panelClass: 'confirm-dialog-container',
            disableClose: true,
            position: { top: '10px' },
            data: {
                message: msg,
                btn: dialogBtn,
                show
            }
        });
    }

}
