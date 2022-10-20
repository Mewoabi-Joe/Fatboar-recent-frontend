import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "./core";
import { Role } from "./models/authentification/role";
import { HomeComponent } from "./components/home/home.component";
import { AuthentificationComponent } from "./components/authentification/authentification/authentification.component";
import { LoginComponent } from "./components/authentification/login/login.component";
import { RequestPasswordComponent } from "./components/authentification/request-password/request-password.component";
import { RegisterComponent } from "./components/authentification/register/register.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { AdminComponent } from "./components/admin/admin/admin.component";
import { StatisticsComponent } from "./components/admin/statistics/statistics.component";
import { GameComponent } from "./components/game/game/game.component";
import { LegalNoticeComponent } from "./components/game/legal-notice/legal-notice.component";
import { HistoricComponent } from "./components/game/historic/historic.component";
import { RegulationComponent } from "./components/game/regulation/regulation.component";
import { ConfidentialiteComponent } from "./components/game/confidentialite/confidentialite.component";
const routes: Routes = [
	{
		path: "auth",
		component: AuthentificationComponent,
		data: { title: "Authentfication" },
		children: [
			{
				path: "login",
				component: LoginComponent,
			},
			{
				path: "requestPassword",
				component: RequestPasswordComponent,
			},
			{
				path: "register",
				component: RegisterComponent,
			},
		],
	},
	{
		path: "",
		component: HomeComponent,
		data: { title: "Home" },
	},
	{
		path: "account",
		loadChildren: () => import("./account/account.module").then((m) => m.AccountModule),
		data: { title: "Account", roles: [Role.Admin, Role.Owner, Role.User] },
	},
	{
		path: "game",
		component: GameComponent,
		data: { title: "Game", roles: [Role.Admin, Role.Owner, Role.User] },
		canActivate: [AuthGuardService],
	},
	{
		path: "historic",
		component: HistoricComponent,
		canActivate: [AuthGuardService],
		data: { title: "historic" },
	},
	{
		path: "legal",
		component: LegalNoticeComponent,
		data: { title: "legal" },
	},
	{
		path: "confidentialite",
		component: ConfidentialiteComponent,
		data: { title: "Confidentialite" },
	},
	{
		path: "rg",
		component: RegulationComponent,
		data: { title: "Règlement du jeu concours" },
	},

	{
		path: "admin",
		component: AdminComponent,
		data: { title: "Admin", roles: [Role.Admin, Role.Owner] },
		canActivate: [AuthGuardService],
	},
	{
		path: "statistics",
		component: StatisticsComponent,
		data: { title: "statistics", roles: [Role.Admin, Role.Owner] },
		canActivate: [AuthGuardService],
	},
	{
		path: "",
		redirectTo: "",
		pathMatch: "full",
	},
	{
		path: "**",
		component: PageNotFoundComponent,
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			initialNavigation: "enabled",
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
