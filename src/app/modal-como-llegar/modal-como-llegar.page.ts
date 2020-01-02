import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-modal-como-llegar',
  templateUrl: './modal-como-llegar.page.html',
  styleUrls: ['./modal-como-llegar.page.scss'],
})
export class ModalComoLlegarPage implements OnInit {
  @Input() rutas: any;
  @Input() travelMode: string;
  distancia : string;
  tiempo : string;
  direccionInicio : string;
  direccionFin : string;
  pasos : Array<any>;
  warnings : Array<any>;

  constructor(public modalController: ModalController, navParams: NavParams) { 
    this.rutas = navParams.get('rutas');
    this.travelMode = navParams.get('travelMode');
    console.log(this.rutas);

    this.distancia = this.rutas.legs[0].distance.text;
    this.tiempo = this.rutas.legs[0].duration.text;
    this.direccionInicio = this.rutas.legs[0].start_address;
    this.direccionFin = this.rutas.legs[0].end_address;
    this.pasos = this.rutas.legs[0].steps;
    this.warnings = this.rutas.warnings;

    console.log(this.distancia);
    console.log(this.tiempo);
    console.log(this.direccionInicio);
    console.log(this.direccionFin);
    console.log(this.pasos);
    console.log(this.warnings);
    
  }

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
