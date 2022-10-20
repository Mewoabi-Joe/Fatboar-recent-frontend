import { Component , OnInit} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'Fatboar-Burger';
  constructor(private titleService: Title, private metaService: Meta) {}
  ngOnInit(): void {
    //      { name: 'keywords', content: 'jeux, jeu,concours, jeu-concours, burgers, restaurent' },
    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      { name: 'robots', content: 'index, follow' },
      { name: 'description', content: 'interface for burger restaurent' },
      { name: 'author', content: 'Furious-Ducks' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'date', content: '2020-11-08', scheme: 'YYYY-MM-DD' },
      { charset: 'UTF-8' }
    ]);

  }

}
