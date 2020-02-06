import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-registrese',
  templateUrl: './modal-registrese.page.html',
  styleUrls: ['./modal-registrese.page.scss'],
})
export class ModalRegistresePage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(public modalController: ModalController, navParams: NavParams) { }

  ngOnInit() {
  }

  cerrarModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
