import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatAccordion } from "@angular/material/expansion";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RegisterService } from "../../services/authentification/register.service";
import { Router } from "@angular/router";
import { DialogService, NotificationService, AuthService, UserPattern } from "../../core";
import { first, map, startWith } from "rxjs/operators";
import { UserService } from "../services/user.service";
import { Observable, Subscription } from "rxjs";
import { Address } from "../../models/authentification/address";
import { User } from "../../models/authentification/user";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

@Component({
	selector: "app-update-profil",
	templateUrl: "./update-profil.component.html",
	styleUrls: ["./update-profil.component.css"],
})
export class UpdateProfilComponent implements OnInit {
	@ViewChild(MatAccordion) accordion: MatAccordion;
	@Output() back = new EventEmitter<boolean>();
	user: User;
	registerForm: FormGroup;
	requestForm: FormGroup;
	loading = false;
	submitted = false;
	loadingRequest = false;
	submitteRequest = false;

	options: Address[] = [];
	filteredOptions: Observable<Address[]>;
	direction: string;
	align: string;
	constructor(
		private formBuilder: FormBuilder,
		private registerService: RegisterService,
		private auth: AuthService,
		private router: Router,
		private notification: NotificationService,
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

		this.getUser();
	}

	async ngOnInit(): Promise<void> {
		this.requestForm = this.formBuilder.group({
			email: ["", [Validators.required, Validators.email, Validators.pattern(UserPattern.EMAIL_PATTERN)]],
		});
		this.registerForm = this.formBuilder.group({
			fname: [""],
			lname: [""],
			userName: ["", Validators.pattern(UserPattern.NAME_PATTERN)],
			email: ["", [Validators.email, Validators.pattern(UserPattern.EMAIL_PATTERN)]],
			adress1: ["", Validators.pattern(UserPattern.ADDRESS_PATTERN)],
			adress2: [""],
			city: ["", Validators.pattern(UserPattern.CITY_PATTERN)],
			zipCode: ["", [Validators.minLength(5), Validators.maxLength(5)]],
			state: [""],
		});
		this.filteredOptions = this.registerForm.valueChanges.pipe(
			startWith(""),
			map((value) => (typeof value === "string" ? value : value.adress1)),
			map((name) => (name ? this._filter(name) : this.options.slice()))
		);
	}

	get f(): { [p: string]: AbstractControl } {
		return this.requestForm.controls;
	}
	async getUser(): Promise<Subscription> {
		return this.userService
			.getById()
			.pipe(first())
			.subscribe((user) => {
				this.user = user.data;
				const fullName = user.data.fullName;
				const splitted = fullName.split(" ");
				this.registerForm.patchValue({
					fname: splitted[0] || "",
					lname: splitted[1] || "",
					userName: user.data.username || "",
					email: user.data.email || "",
					adress2: user.data.address.address2 || "",
					adress1: {
						address1: user.data.address.address1 || "",
						city: user.data.address.city || "",
						zip: user.data.address.zip || "",
						state: user.data.address.state || "",
					},
				});
			});
	}
	displayFn(address: Address): string {
		if (address) {
			this.registerForm.patchValue({ zipCode: address.zip, city: address.city, state: address.state });
		}

		return address && address.address1 ? address.address1 : "";
	}

	private _filter(name: string): Address[] {
		if (typeof name !== "string") {
			return [];
		}
		const filterValue = name.toLowerCase();
		return this.options.filter((option) => option.address1.toLowerCase().indexOf(filterValue) === 0);
	}

	isUserNameToken(event: any): void {
		if (
			this.registerForm.value.userName &&
			this.registerForm.value.userName !== this.user.username &&
			UserPattern.NAME_PATTERN.test(event.target.value)
		) {
			this.auth.verifyUserName(event.target.value).subscribe((res) => {
				this.registerForm.controls.userName.setErrors(res);
			});
		}
	}

	sendRequest(): void {
		try {
			this.loadingRequest = true;
			this.submitteRequest = true;

			if (this.requestForm.invalid) {
				this.submitteRequest = false;
				this.loadingRequest = false;
				this.notification.openSnackBarComponent("login.requiredInput");
				return;
			}
			this.auth.requestResetPassword(this.requestForm.value.email).subscribe({
				next: () => {
					this.submitteRequest = false;
					this.loadingRequest = false;
					this.notification.openSnackBarComponent("resetPwd.successMsg");
					return;
				},
				error: (error) => {
					this.submitteRequest = false;
					this.loadingRequest = false;
					this.notification.openSnackBarComponent(error);
				},
			});
		} catch (e) {
			this.notification.openSnackBarComponent(e.toString());
			this.submitteRequest = false;
			this.loadingRequest = false;
		}
	}
	checkAddress(): boolean {
		const address1 = this.registerForm.value.adress1.address1
			? this.registerForm.value.adress1.address1
			: this.registerForm.value.adress1;
		return (
			this.user.address.address1 === address1 &&
			this.user.address.city === this.registerForm.value.city &&
			this.user.address.zip === this.registerForm.value.zipCode
		);
	}
	checkFullName(): boolean {
		return this.user.fullName === this.registerForm.value.fname + " " + this.registerForm.value.lname;
	}
	onSubmit(): void {
		this.submitted = true;
		this.loading = true;
		if (this.user.username === this.registerForm.value.userName && this.checkFullName() && this.checkAddress()) {
			this.notification.openSnackBarComponent("account.errChange");
			this.submitted = false;
			this.loading = false;
			return;
		}

		const model: User = {};

		if (this.registerForm.value.userName && this.registerForm.value.userName !== this.user.username) {
			model.username = this.registerForm.value.userName;
		}
		if (!this.checkFullName() && this.registerForm.value.fname && this.registerForm.value.lname) {
			model.fullName = this.registerForm.value.fname + " " + this.registerForm.value.lname;
		}
		const address = this.registerForm.value.adress1.address1
			? this.registerForm.value.adress1.address1
			: this.registerForm.value.adress1;
		if (!this.checkAddress() && this.registerForm.value.city && this.registerForm.value.zipCode.toString()) {
			model.address = {
				address1: address,
				address2: this.registerForm.value.adress2,
				city: this.registerForm.value.city,
				zip: this.registerForm.value.zipCode.toString(),
				state: this.registerForm.value.state,
			};
		}
		if (!model || JSON.stringify(model) === "{}") {
			this.notification.openSnackBarComponent("account.errChange");
			this.submitted = false;
			this.loading = false;
			return;
		}
		this.userService
			.updateAccount(model)
			.pipe(first())
			.subscribe({
				next: () => {
					this.notification.openSnackBarComponent("account.updateSuccess");
					this.back.emit(false);
					this.loading = false;
					this.registerForm.reset();
					this.submitted = false;
				},
				error: () => {
					this.loading = false;
					this.submitted = false;
				},
			});
	}

	adresseChange(e): void {
		try {
			if (e.target.value.length > 1) {
				this.registerService.getAdresse(e.target.value).subscribe((res) => {
					if (res && res.features.length > 0) {
						this.options = res.features.map((o) => {
							return {
								label: o.properties.label,
								address1: `${o.properties.housenumber} ${o.properties.street}`,
								zip: o.properties.postcode,
								city: o.properties.city,
								state: o.properties.context,
								country: "France",
							};
						});
					}
				});
			}
		} catch (e) {
			console.error(e.message);
		}
	}
	goToUserInfo(): void {
		this.back.emit(false);
	}
}
