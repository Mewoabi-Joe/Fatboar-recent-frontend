import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AccountComponent} from './account/account.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {ConfirmEmailComponent} from './confirm-email/confirm-email.component';
import {AuthGuardService} from '../core';

const routes: Routes = [{ path: '', component: AccountComponent,  canActivate: [AuthGuardService]},
  {
  path: 'resetPassword', component: ResetPasswordComponent
},
  {
  path: 'confirmEmail', component: ConfirmEmailComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
