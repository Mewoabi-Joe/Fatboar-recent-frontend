import { Component, OnInit } from "@angular/core";
import { AuthService, NotificationService } from "../../../core";
import { Router, ActivatedRoute } from "@angular/router";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
	hide = true;
	loginForm: FormGroup;
	loading = false;
	isLogIn = false;
	submitted = false;
	requestPwd: boolean;
	basicAuth = true;

	constructor(
		private authService: SocialAuthService,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private auth: AuthService,
		private notification: NotificationService,
		library: FaIconLibrary
	) {
		library.addIcons(faGoogle, faFacebook);
	}

	ngOnInit(): void {
		this.auth.logoutWithoutRedirect();
		this.requestPwd = false;
		this.loginForm = this.formBuilder.group({
			identifier: ["", Validators.required],
			password: ["", Validators.required],
		});
	}

	get f(): { [p: string]: AbstractControl } {
		return this.loginForm.controls;
	}

	onSubmit(): void {
		this.submitted = true;
		if (this.loginForm.invalid) {
			this.notification.openSnackBarComponent("login.requiredInput");
			return;
		}
		this.loading = true;
		this.auth.login(this.f.identifier.value, this.f.password.value).subscribe({
			next: (user) => {
				this.loading = false;
				const returnUrl = this.route.snapshot.queryParams.returnUrl || "/";
				this.router.navigateByUrl(returnUrl);
				return user;
			},
			error: (error) => {
				this.notification.openSnackBarComponent(error);
				this.isLogIn = true;
				this.loading = false;
				this.submitted = false;
			},
		});
	}
	async signInWithGoogle(): Promise<void> {
		this.basicAuth = !this.basicAuth;
		const userSocial = await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
		if (userSocial) {
			this.loginSocial(userSocial);
		}
	}

	basicAuthentification(): void {
		this.basicAuth = !this.basicAuth;
	}

	async signInWithFacebook(): Promise<void> {
		this.basicAuth = !this.basicAuth;
		const userSocial = await this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
		if (userSocial) {
			this.loginSocial(userSocial);
		}
	}
	loginSocial(userSocial): void {
		try {
			if (userSocial) {
				const fullName = userSocial.firstName + " " + userSocial.lastName;
				this.auth.loginSocial(userSocial.email, fullName, userSocial.provider).subscribe({
					next: (userInfo) => {
						const returnUrl = this.route.snapshot.queryParams.returnUrl || "/";
						this.router.navigateByUrl(returnUrl);
						this.submitted = false;
						this.loading = false;
						return userInfo;
					},
					error: (error) => {
						this.submitted = false;
						this.loading = false;
						this.notification.openSnackBarComponent(error);
					},
				});
			}
		} catch (e) {
			this.notification.openSnackBarComponent(e.toString());
		}
	}
	requestResetPwd(value): void {
		this.requestPwd = value;
	}
}
