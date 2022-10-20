import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { first, map, startWith } from "rxjs/operators";
import { UserRegistrationModel } from "../../../models/authentification/UserRegistrationModel";
import { UserRegSocial } from "../../../models/authentification/userRegSocial";
import { MatAccordion } from "@angular/material/expansion";
import { NotificationService, DialogService, UserPattern, AuthService } from "../../../core";
import { Address } from "../../../models/authentification/address";
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Observable } from "rxjs";
import { RegisterService } from "../../../services/authentification/register.service";
import * as EmailValidator from "email-validator";
@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
	@Output() tabEvent = new EventEmitter<number>();
	@ViewChild(MatAccordion) accordion: MatAccordion;
	registerForm: FormGroup;
	registerSocialForm: FormGroup;
	model: UserRegSocial = new UserRegSocial();
	loading = false;
	submitted = false;
	regle = false;
	basicAuth = true;
	options: Address[] = [];
	filteredOptions: Observable<Address[]>;
	address: Address;
	@Input() userType: string;
	@Input() nextPage: string;

	constructor(
		private registerService: RegisterService,
		private formBuilder: FormBuilder,
		private authService: SocialAuthService,
		private auth: AuthService,
		private route: ActivatedRoute,
		private router: Router,
		private notification: NotificationService,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		if (this.userType !== "User") {
			this.basicAuth = true;
		}
		this.registerForm = this.formBuilder.group({
			fname: ["", Validators.required],
			lname: ["", Validators.required],
			userName: [
				"",
				[
					Validators.required,
					Validators.pattern(UserPattern.NAME_PATTERN),
					Validators.minLength(3),
					Validators.maxLength(15),
				],
			],
			email: ["", [Validators.required, Validators.email, Validators.pattern(UserPattern.EMAIL_PATTERN)]],
			password: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
			adress1: ["", [Validators.required, Validators.pattern(UserPattern.ADDRESS_PATTERN)]],
			adress2: ["", Validators.pattern(UserPattern.ADDRESS_PATTERN)],
			city: ["", [Validators.required, Validators.pattern(UserPattern.CITY_PATTERN)]],
			zipCode: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
			passwordConfirmation: ["", [Validators.required, this.checkPasswords.apply(this)]],
			state: [""],
			legal: [false, Validators.required],
			newsLettre: [false],
		});
		this.registerSocialForm = this.formBuilder.group({
			legal: [false, Validators.required],
			newsLettre: [false],
		});
		this.filteredOptions = this.registerForm.valueChanges.pipe(
			startWith(""),
			map((value) => (typeof value === "string" ? value : value.adress1)),
			map((name) => (name ? this._filter(name) : this.options.slice()))
		);
		setTimeout(() => {
			this.accordion.openAll();
		}, 1000);
	}

	displayFn(address: Address): string {
		if (address) {
			this.registerForm.patchValue({
				zipCode: address.zip,
				city: address.city,
				state: address.state,
			});
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
	async signInWithFacebook(): Promise<void> {
		this.basicAuth = false;
		this.regle = true;
		const userSocial = await this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
		if (userSocial) {
			this.registerSocial(userSocial);
		}
	}
	async signInWithGoogle(): Promise<void> {
		this.basicAuth = false;
		this.regle = true;
		const userSocial = await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
		if (userSocial) {
			this.registerSocial(userSocial);
		}
	}
	registerSocial(userSocial: any): void {
		try {
			if (userSocial) {
				const fullName = userSocial.firstName + " " + userSocial.lastName;

				this.model.email = userSocial.email;
				this.model.type = "User";
				this.model.fullName = fullName;
				this.model.provider = userSocial.provider;
				console.log(this.model);
			} else {
				this.model = null;
			}
		} catch (e) {
			this.notification.openSnackBarComponent(e.toString());
		}
	}
	basicAuthentification(): void {
		this.regle = false;
		this.basicAuth = true;
		setTimeout(() => {
			this.accordion.openAll();
		}, 100);
		console.log("print this");
	}
	onSubmitSocial(): void {
		try {
			this.submitted = true;
			if (!this.registerSocialForm.value.legal) {
				this.notification.openSnackBarComponent("register.legalNotification");
				this.submitted = false;
				return;
			}
			if (!this.model.email) {
				this.notification.openSnackBarComponent("login.failedSocial");
				this.submitted = false;
				return;
			}
			this.model.isLegalNoticeAccepted = this.registerSocialForm.value.legal;
			this.model.newsLettre = this.registerSocialForm.value.newsLettre;
			this.loading = true;
			this.registerService.registerSocial(this.model).subscribe({
				next: () => {
					this.tabEvent.emit(0);
					this.registerForm.reset();
					this.registerSocialForm.reset();
					this.loading = false;
					this.submitted = false;
					this.model = null;
				},
				error: (error) => {
					this.notification.openSnackBarComponent(error);
					this.loading = false;
					this.submitted = false;
					this.model = null;
				},
			});
		} catch (e) {
			this.notification.openSnackBarComponent(e.toString());
			this.loading = false;
			this.submitted = false;
			this.model = null;
		}
	}

	isUserNameToken(event: any): void {
		if (UserPattern.NAME_PATTERN.test(event.target.value)) {
			this.auth.verifyUserName(event.target.value).subscribe((res) => {
				this.registerForm.controls.userName.setErrors(res);
			});
		}
	}

	isEmailToken(event: any): void {
		if (EmailValidator.validate(event.target.value)) {
			this.auth.verifyEmail(event.target.value).subscribe((res) => {
				this.registerForm.controls.email.setErrors(res);
			});
		}
	}
	private checkPasswords(): (control: FormGroup) => { notSame: boolean } {
		const that = this;
		return (control: FormGroup) => {
			const pass = control.value;
			const confirmPass = that.registerForm ? that.registerForm.value.password : null;

			return pass === confirmPass ? null : { notSame: true };
		};
	}

	onSubmit(): void {
		this.submitted = true;
		if (!this.registerForm.value.legal || !this.userType) {
			this.notification.openSnackBarComponent("register.legalNotification");
			this.submitted = false;
			return;
		}
		if (this.registerForm.invalid) {
			this.notification.openSnackBarComponent("login.requiredInput");
			this.submitted = false;
			return;
		}
		if (
			(this.registerForm.value.adress1.address1 && !this.registerForm.value.city) ||
			!this.registerForm.value.zipCode
		) {
			this.notification.openSnackBarComponent("account.errAddress");
			this.submitted = false;
			return;
		}
		const model: UserRegistrationModel = new UserRegistrationModel();
		model.fullName = this.registerForm.value.fname + " " + this.registerForm.value.lname;
		model.email = this.registerForm.value.email;
		model.password = this.registerForm.value.password;
		model.username = this.registerForm.value.userName;
		model.isLegalNoticeAccepted = this.registerForm.value.legal;
		model.newsLettre = this.registerForm.value.newsLettre;
		model.address = {
			address1: this.registerForm.value.adress1.address1
				? this.registerForm.value.adress1.address1
				: this.registerForm.value.adress1,
			address2: this.registerForm.value.adress2,
			city: this.registerForm.value.city,
			zip: this.registerForm.value.zipCode.toString(),
			state: this.registerForm.value.state,
		};

		model.type = this.userType;
		this.loading = true;
		this.registerService
			.register(model)
			.pipe(first())
			.subscribe({
				next: () => {
					if (this.nextPage === "auth") {
						this.tabEvent.emit(0);
					} else {
						this.router.navigateByUrl(this.nextPage);
					}
					this.registerForm.reset();
					this.registerSocialForm.reset();
					this.model = null;
					this.submitted = false;
				},
				error: (error) => {
					this.notification.openSnackBarComponent(error);
					this.loading = false;
					this.model = null;
					this.submitted = false;
				},
			});
	}

	legalNotice(): void {
		this.dialogService.openConfirmDialogLegal(null, false, true);
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
							};
						});
					}
				});
			}
		} catch (e) {
			console.error(e.message);
		}
	}
}
