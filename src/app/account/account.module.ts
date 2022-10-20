import { NgModule } from '@angular/core';

import { AccountRoutingModule } from './account-routing.module';
import {CoreModule} from '../core';
import { AccountComponent } from './account/account.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UpdateProfilComponent } from './update-profil/update-profil.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';

@NgModule({
  declarations: [AccountComponent, UserInfoComponent,
    UpdateProfilComponent,
    ResetPasswordComponent,
    ConfirmEmailComponent],
  imports: [
    CoreModule,
    AccountRoutingModule,
  ]
})
export class AccountModule { }
