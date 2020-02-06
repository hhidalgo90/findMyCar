import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { ModalRegistresePage } from '../modal-registrese/modal-registrese.page';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  emailUser = "";
  passUser = "";
  formLogin : FormGroup;
  mostrarEmailPass : boolean;
  mostrarOpcionesLogin : boolean;

  constructor(public modalController: ModalController) { 
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.formLogin = new FormGroup({      
      passUser: new FormControl('', [Validators.required]),
      emailUser: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)])
    });
  }

  ngOnInit() {
    this.mostrarEmailPass = false;
    this.mostrarOpcionesLogin = false;
  }


  async mostrarModalRegistro() {
    const modal = await this.modalController.create({
      component: ModalRegistresePage,
      mode: "ios",
      cssClass: "modalClass",
      backdropDismiss: false
    });
    return await modal.present();
  }

  loginEmailPass(){
    this.mostrarEmailPass = true;
  }

  mostrarMenu(){
    this.mostrarEmailPass = false;
  }

}
