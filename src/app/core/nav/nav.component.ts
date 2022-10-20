import {Component, OnInit, ViewChild} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import { User} from '../../models/authentification/user';
import { AuthService} from '../services/auth.service';
import { Observable} from 'rxjs';
import {NgcCookieConsentService} from 'ngx-cookieconsent';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
    user$: Observable<User> ;
    // tslint:disable-next-line:variable-name
    @ViewChild('drawer') _drawer;
  isHandset: boolean;
  constructor(private breakpointObserver: BreakpointObserver,
              public translate: TranslateService, private auth: AuthService, private ccService: NgcCookieConsentService) {
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map(result => result.matches))
      .subscribe(isHandset => {
          this.isHandset = isHandset;
      });
    translate.addLangs(['fr', 'en']);
    const lng = localStorage.getItem('lng');
    translate.setDefaultLang(lng ? lng : 'fr');
    translate.use(lng ? lng  : 'fr');
    translate.get(['cookie.header', 'cookie.message', 'cookie.dismiss', 'cookie.allow', 'cookie.deny', 'cookie.link', 'cookie.policy'])
        .subscribe(data => {

          this.ccService.getConfig().content = this.ccService.getConfig().content || {} ;
          // Override default messages with the translated ones
          this.ccService.getConfig().content.header = data['cookie.header'];
          this.ccService.getConfig().content.message = data['cookie.message'];
          this.ccService.getConfig().content.dismiss = data['cookie.dismiss'];
          this.ccService.getConfig().content.allow = data['cookie.allow'];
          this.ccService.getConfig().content.deny = data['cookie.deny'];
          this.ccService.getConfig().content.link = data['cookie.link'];
          this.ccService.getConfig().content.policy = data['cookie.policy'];

          this.ccService.destroy(); // remove previous cookie bar (with default messages)
          this.ccService.init(this.ccService.getConfig()); // update config with translated messages
        });
    this.user$ = this.auth.user;

  }

   ngOnInit(): void {

   }


  toggle(): void {
      this._drawer.toggle();
  }
  logout(): void {
  this.auth.logout();
  this._drawer.toggle();
  }
  changeLang(lang): void {
    this.translate.use(lang);
    localStorage.setItem('lng', lang);
  }

}
