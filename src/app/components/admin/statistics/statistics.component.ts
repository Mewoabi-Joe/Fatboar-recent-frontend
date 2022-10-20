import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {StatisticsService} from '../../../services/admin/statistics.service';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
    statistics$: Observable<any>;
    carWinnerStatistics$: Observable<any>;
  constructor( private  statisticService: StatisticsService) {
      this.statistics$ = this.statisticService.statistic;
      this.carWinnerStatistics$ = this.statisticService.carWinnerStatistic;
  }

    async ngOnInit(): Promise<void> {
      await (await this.statisticService.getStatistic()).subscribe();
      await (await this.statisticService.getCarWinnerStatistic()).subscribe();
}

}
