import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { CoreModule } from "./core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SocialLoginModule, SocialAuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { NgcCookieConsentConfig, NgcCookieConsentModule } from "ngx-cookieconsent";
import { HomeComponent } from "./components/home/home.component";
import { AuthentificationComponent } from "./components/authentification/authentification/authentification.component";
import { RegisterComponent } from "./components/authentification/register/register.component";
import { LoginComponent } from "./components/authentification/login/login.component";
import { RequestPasswordComponent } from "./components/authentification/request-password/request-password.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { AdminComponent } from "./components/admin/admin/admin.component";
import { StatisticsComponent } from "./components/admin/statistics/statistics.component";
import { GameComponent } from "./components/game/game/game.component";
import { HistoricComponent } from "./components/game/historic/historic.component";
import { LegalNoticeComponent } from "./components/game/legal-notice/legal-notice.component";
import { GoogleChartsModule } from "angular-google-charts";
import { RegulationComponent } from "./components/game/regulation/regulation.component";
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { ConfidentialiteComponent } from "./components/game/confidentialite/confidentialite.component";

export function HttpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
	return new TranslateHttpLoader(httpClient, "./assets/i18n/", ".json");
}

const cookieConfig: NgcCookieConsentConfig = {
	cookie: {
		domain: environment.cookieDomain,
	},
	palette: {
		popup: {
			background: "#000",
		},
		button: {
			background: "#B22226",
		},
	},
	theme: "edgeless",
	type: "opt-out",
};
registerLocaleData(localeFr); // @ts-ignore
@NgModule({
	declarations: [
		HomeComponent,
		AppComponent,
		GameComponent,
		AdminComponent,
		StatisticsComponent,
		HistoricComponent,
		PageNotFoundComponent,
		AuthentificationComponent,
		LoginComponent,
		RegisterComponent,
		RequestPasswordComponent,
		LegalNoticeComponent,
		RegulationComponent,
		ConfidentialiteComponent,
	],
	imports: [
		NgcCookieConsentModule.forRoot(cookieConfig),
		BrowserModule.withServerTransition({ appId: "serverApp" }),
		AppRoutingModule,
		BrowserAnimationsModule,
		CoreModule,
		SocialLoginModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient],
			},
		}),
		ServiceWorkerModule.register("ngsw-worker.js", { enabled: environment.production }),
		GoogleChartsModule,
		MDBBootstrapModule.forRoot(),
	],
	providers: [
		{
			provide: "SocialAuthServiceConfig",
			useValue: {
				autoLogin: false,
				providers: [
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider: new GoogleLoginProvider(environment.GOOGLEID),
					},
					{
						id: FacebookLoginProvider.PROVIDER_ID,
						provider: new FacebookLoginProvider(environment.FACEBOOKID),
					},
				],
			} as SocialAuthServiceConfig,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
