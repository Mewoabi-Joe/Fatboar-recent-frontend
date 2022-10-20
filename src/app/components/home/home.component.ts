import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	cards = [
		{
			title: "60% de chance d'avoir une ENTREE OU DESSERT AU CHOIX",
			img: "assets/slider/1.2.png",
		},
		{
			title: "20% de chance d'avoir un BURGER AU CHOIX",
			img: "assets/slider/1.3.png",
		},
		{
			title: "10% de chance d'avoir un MENU DU JOUR",
			img: "assets/slider/1.4.png",
		},
		{
			title: "6% de chance d'avoir un MENU AU CHOIX",
			img: "assets/slider/1.5.png",
		},
		{
			title: "4% de chance d'avoir un BON DE 70% DE REDUCTION",
			img: "assets/slider/1.6.png",
		},
		{
			title: "Tirage final RANGE ROVER",
			img: "assets/slider/car.png",
		},
	];
	slides: any = [[]];
	constructor(private router: Router) {}
	chunk(arr, chunkSize): any[] {
		const R = [];
		for (let i = 0, len = arr.length; i < len; i += chunkSize) {
			R.push(arr.slice(i, i + chunkSize));
		}
		return R;
	}
	ngOnInit(): void {
		this.slides = this.chunk(this.cards, 3);
	}

	gotoGame = () => {
		this.router.navigate(["/game"]);
	};
}
