import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {

  nextPage = 'auth';
  userType = 'User';
  index: number;
  constructor() { }

  ngOnInit(): void {
    this.index = 0;
  }




  onTabChanged(event: MatTabChangeEvent): void {
  this.index = event.index;
  }
  addItem(event: number): void {
  this.index = event;
  }

}
