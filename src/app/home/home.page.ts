import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { SlideOptions } from './slide-options';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage extends SlideOptions{
  @ViewChild("IonSlides" , {read : ElementRef, static : true}) protected slides: ElementRef<IonSlides>;

  constructor() {
    super();
  }

  irSiguienteSlide() {
    console.log();
    this.slideNext();
}

async getActiveIndex(): Promise<number> {
  return this.slides.nativeElement.getActiveIndex();
}

async slideNext(): Promise<void> {
  console.log("slideNext");
  this.slides.nativeElement.lockSwipeToNext(false);
  await this.slides.nativeElement.slideNext(1000);
}

bloquearSwipe(){
  console.log("bloquearSwipe");
  
  this.slides.nativeElement.lockSwipeToNext(true);
  this.slides.nativeElement.lockSwipeToPrev(true);
}
}
