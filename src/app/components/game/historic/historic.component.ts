import { Component, OnInit } from '@angular/core';
import {GameService} from '../../../services/game/game.service';
import {Observable} from 'rxjs';
@Component({
  selector: 'app-historic',
  templateUrl: './historic.component.html',
  styleUrls: ['./historic.component.css']
})
export class HistoricComponent implements OnInit {
  historicList$: Observable<any>;
  constructor( private gameService: GameService) {

    this.historicList$ = this.gameService.historic;
  }

  async  ngOnInit(): Promise<void> {
   await (await this.gameService.getHistoric()).subscribe();
  }

}
