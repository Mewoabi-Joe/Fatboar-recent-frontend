import {Component, Input, OnChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {BehaviorSubject, Observable} from 'rxjs';
import {delay, map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-lazy-image',
  templateUrl: './lazy-image.component.html',
  styleUrls: ['./lazy-image.component.css']
})
export class LazyImageComponent implements OnChanges {

  // we need HttpClient to load the image
  constructor(private httpClient: HttpClient, private domSanitizer: DomSanitizer) {
  }
  // This code block just creates an rxjs stream from the src
  // this makes sure that we can handle source changes
  // or even when the component gets destroyed
  // So basically turn src into src$
  @Input() private src: string;
  @Input()  alt: string;
  @Input()   delayValue: number;
  private src$ = new BehaviorSubject(this.src);
  // this stream will contain the actual url that our img tag will load
  // everytime the src changes, the previous call would be canceled and the
  // new resource would be loaded
  dataUrl$ = this.src$.pipe(switchMap(url => this.loadImage(url)));
  ngOnChanges(): void {

    this.src$.next(this.src);
  }

  private loadImage(url: string): Observable<any> {


    return this.httpClient
        // load the image as a blob
        .get(url, {responseType: 'blob'})
        // create an object url of that blob that we can use in the src attribute
        .pipe(delay( this.delayValue ), map(e =>
           this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(e))
        ));
  }

}
