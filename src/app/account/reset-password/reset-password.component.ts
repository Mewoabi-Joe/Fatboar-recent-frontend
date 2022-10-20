import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService, NotificationService, UserPattern} from '../../core';
import {ActivatedRoute, Router} from '@angular/router';
import { UserService} from '../services/user.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  loading = false;
  verificationToken: string;
  hide = true;
  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private route: ActivatedRoute,
              private auth: AuthService,
              private router: Router,
              private notification: NotificationService ) {
    this.route.queryParams.subscribe(params => {
      this.verificationToken = params.t;
    });
  }

  ngOnInit(): void {
    this.auth.logoutWithoutRedirect();
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(UserPattern.PASSWORD_PATTERN)]],
      passwordConfirmation: ['', [Validators.required, this.checkPasswords.apply(this)]], });
  }

  private checkPasswords(): (control: FormGroup) => {notSame: boolean} {
    const that = this;
    return (control: FormGroup) => {
      const pass = control.value;
      const confirmPass = that.resetForm ? that.resetForm.value.password : null;

      return pass === confirmPass ? null : { notSame: true };
    };
  }
  onSubmit(): void {
    try{
      this.submitted = true;
      this.loading = true;
      if (!this.verificationToken){
        this.submitted = false;
        this.loading = false;
        this.notification.openSnackBarComponent('resetPwd.token');
        return;
      }
      if (this.resetForm.invalid) {
        this.submitted = false;
        this.loading = false;
        this.notification.openSnackBarComponent('login.requiredInput');
        return;
      }
      const body = {
        verificationToken: this.verificationToken,
        password: this.resetForm.value.password
      };
      this.userService.resetPassword(body).subscribe({
        next: () => {
          this.submitted = false;
          this.loading = false;
          this.notification.openSnackBarComponent('resetPwd.successMsgResetPwd');
          this.router.navigateByUrl('auth');
          return;
        },
        error: err => {
          this.submitted = false;
          this.loading = false;
          this.notification.openSnackBarComponent(err.toString());
        }
      });
    }
    catch (e) {
      this.notification.openSnackBarComponent(e.toString());
    }

  }
}
