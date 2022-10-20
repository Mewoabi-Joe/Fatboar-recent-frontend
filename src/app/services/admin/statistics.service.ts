import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private statisticSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public statistic: Observable<any>;
  private carWinnerStatisticSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public carWinnerStatistic: Observable<any>;
  constructor(private http: HttpClient) {
    this.statistic = this.statisticSubject.asObservable();
    this.carWinnerStatistic = this.carWinnerStatisticSubject.asObservable();
  }

  async getStatistic(): Promise<Observable<any>> {
    return  this.http.get<any>(`${environment.API_URL}/statistic`).pipe(map(result => {
      return this.statisticSubject.next(result.data);
    }));
  }
  async getCarWinnerStatistic(): Promise<Observable<any>> {
    return  this.http.get<any>(`${environment.API_URL}/statistic/getCarWinner`).pipe(map(result => {
      return this.carWinnerStatisticSubject.next(result.data);
    }));
  }
}
