import { Component, OnInit, ViewChild } from "@angular/core";
import { first } from "rxjs/operators";
import { User } from "../../models/authentification/user";
import { UserService } from "../services/user.service";
import { NotificationService } from "../../core";
import { MatAccordion } from "@angular/material/expansion";

@Component({
	selector: "app-user-info",
	templateUrl: "./user-info.component.html",
	styleUrls: ["./user-info.component.css"],
})
export class UserInfoComponent implements OnInit {
	@ViewChild(MatAccordion) accordion: MatAccordion;
	loading = true;
	userFromApi: User;
	adresse = false;
	constructor(private userService: UserService, private notification: NotificationService) {}

	ngOnInit(): void {
		this.loading = true;
		this.userService
			.getById()
			.pipe(first())
			.subscribe((user) => {
				this.loading = false;
				this.userFromApi = user.data;
				if (this.userFromApi && this.userFromApi.address) {
					this.adresse = true;
				}
			});
	}
	sendConfirmEmail(): void {
		this.userService.sendConfirmeEmail().subscribe({
			next: () => {
				this.notification.openSnackBarComponent("account.sendEmail");
			},
			error: (err) => {
				this.notification.openSnackBarComponent(err.toString());
			},
		});
	}
}
