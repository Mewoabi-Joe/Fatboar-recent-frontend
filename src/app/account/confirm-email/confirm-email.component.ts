import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService, AuthService} from '../../core';
import { UserService} from '../services/user.service';
@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {
  verificationToken: string;
  loading = false;
  confirmed: boolean;
  constructor( private router: Router, private  route: ActivatedRoute,
               private auth: AuthService,
               private notification: NotificationService,
               private userService: UserService
              )
  {     this.route.queryParams.subscribe(params => {
    this.verificationToken = params.t;
  });
  }

  ngOnInit(): void {
    this.confirmed = false;
    this.auth.logoutWithoutRedirect();
    if (this.verificationToken){
      this.userService.confirmeEmail(this.verificationToken).subscribe({
        next: () => {
          this.loading = false;
          this.confirmed = true;
          this.router.navigate(['/auth']);
        },
        error: err => {
          this.loading = false;
          this.notification.openSnackBarComponent(err.toString());
          this.router.navigate(['/']);
        }
      });
    }else {
      this.router.navigate(['/']);
    }

  }

}
