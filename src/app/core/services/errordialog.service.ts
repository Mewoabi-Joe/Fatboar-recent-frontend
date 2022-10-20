import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { ErrorMsg } from '../models/error.model';

@Injectable({
  providedIn: 'root'
})
export class ErrordialogService {


    constructor(public dialog: MatDialog) { }

    openDialog(data: { reason: any; status: string }): void {
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
            width: '300px',
            data
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            let animal;
            animal = result;
        });
    }
}
