import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../core';
import {AuthService} from '../../../core';

@Component({
  selector: 'app-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.css']
})
export class RequestPasswordComponent implements OnInit {
  @Output() requestPwdEmit = new EventEmitter<boolean>();
  requestForm: FormGroup;
  submitted = false;
  loading = false;
  constructor(     private formBuilder: FormBuilder,        private notification: NotificationService,    private auth: AuthService) { }

  ngOnInit(): void {
    this.requestForm = this.formBuilder.group({email: ['', [Validators.required, Validators.email]]});
  }
  get f(): {[p: string]: AbstractControl} { return this.requestForm.controls; }
  goBack(): void{
    this.requestPwdEmit.emit(false);
  }
  onSubmit(): void{
    try {
      this.submitted = true;
      this.loading = true;
      if (this.requestForm.invalid) {
        this.submitted = false;
        this.loading = false;
        this.notification.openSnackBarComponent('login.requiredInput');
        return;
      }
      this.auth.requestResetPassword(this.requestForm.value.email).subscribe({ next: () => {
          this.submitted = false;
          this.loading = false;
          this.requestPwdEmit.emit(false);
          return;
        },
        error: error => {
          this.submitted = false;
          this.loading = false;
          this.notification.openSnackBarComponent(error); }
      });
    }catch (e) {
      this.notification.openSnackBarComponent(e.toString());
    }
  }
}
