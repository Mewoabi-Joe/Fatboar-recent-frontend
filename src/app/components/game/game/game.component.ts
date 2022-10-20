import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {GameService} from '../../../services/game/game.service';
import {MatHorizontalStepper} from '@angular/material/stepper';
import {AuthService} from '../../../core';
import {User} from '../../../core/models/user';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  secondFormGroup: FormGroup;
  gain$: Observable<any>;
  user: User;
  constructor(private formBuilder: FormBuilder, private gameService: GameService, private auth: AuthService) {
    this.gain$ = this.gameService.gain;
    this.user = this.auth.userValue;

  }

  ngOnInit(): void {
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)], this.isTicketToken()]
    });
  }
  isTicketToken(): (control: AbstractControl) => Observable<{ isTicketAvailable: boolean }> {
    return (control: AbstractControl): Observable<{ isTicketAvailable: boolean }> => {
      return this.gameService.verifyTickets(control.value);
    };
  }

  reset(stepper: MatHorizontalStepper): void {
    stepper.reset();
    this.gameService.resetData();
  }
}
