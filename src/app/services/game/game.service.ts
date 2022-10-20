import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gainSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private historicSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public gain: Observable<any>;
  public historic: Observable<any>;

  constructor( private http: HttpClient) {
    this.gain = this.gainSubject.asObservable();
    this.historic = this.historicSubject.asObservable();
  }


  verifyTickets(tickets: string): Observable<{ isTicketAvailable: boolean }> {
    const body = {
      token: tickets
    };
    return this.http.post<any>(`${environment.API_URL}/games/checkTicket`, body ).pipe(map(res => {
      this.gainSubject.next(res.data);
      return res ? null : { isTicketAvailable: true};
    }));
  }
  resetData(): void {
    this.gainSubject.next(null);
  }
  async getHistoric(): Promise<Observable<any>> {
    return  this.http.get<any>(`${environment.API_URL}/games/historic`).pipe(map(result => {
      return this.historicSubject.next(result.data.ticketsList);
    }));
  }

}
