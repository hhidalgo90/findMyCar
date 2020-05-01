import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-registrese',
  templateUrl: './modal-registrese.page.html',
  styleUrls: ['./modal-registrese.page.scss'],
})
export class ModalRegistresePage implements OnInit {
  @Input() texto: String;

  constructor(public modalController: ModalController, navParams: NavParams, private router : Router) { }

  ngOnInit() {
  }

  cerrarModal() {
    this.router.navigateByUrl("/usuarioLogueado/historialEstacionamientos");
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true      
    });
  }

}
