import { Component, OnInit } from "@angular/core";
import { User } from "../../models/authentification/user";
import { Observable } from "rxjs";
import { DialogService, AuthService } from "../../core";
import { UserService } from "../services/user.service";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map } from "rxjs/operators";
@Component({
	selector: "app-account",
	templateUrl: "./account.component.html",
	styleUrls: ["./account.component.css"],
})
export class AccountComponent implements OnInit {
	user$: Observable<User>;
	update = false;
	goBack = false;
	direction: string;
	align: string;
	constructor(
		private auth: AuthService,
		private dialogService: DialogService,
		private userService: UserService,
		private breakpointObserver: BreakpointObserver
	) {
		this.breakpointObserver
			.observe(Breakpoints.Handset)
			.pipe(map((result) => result.matches))
			.subscribe((isHandset) => {
				if (isHandset) {
					this.direction = "column";
					this.align = "space-between center";
				} else {
					this.direction = "row";
					this.align = "space-evenly center";
				}
			});
	}

	async ngOnInit(): Promise<void> {
		await this.getUser();
	}

	async getUser(): Promise<void> {
		try {
			this.user$ = await this.auth.user;
		} catch (error) {
			console.error("error=>", error);
		}
	}
	deleteAccount(): void {
		this.dialogService
			.openConfirmDialog("account.deleteMsg", true)
			.afterClosed()
			.subscribe((res) => {
				if (res) {
					this.userService.deleteAccount().subscribe(async () => {
						await this.auth.logout();
					});
				}
			});
	}

	updateAccount(): void {
		this.goBack = true;
		this.update = true;
	}

	showUpdate(): boolean {
		return !this.update;
	}

	navigate(): void {
		this.update = false;
		this.goBack = false;
	}
}
