import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController  } from "@ionic/angular";
import { ModalRegistresePage } from '../modal-registrese/modal-registrese.page';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  public loading: HTMLIonLoadingElement;

  constructor(public modalController: ModalController, public loadingCtrl: LoadingController, private router: Router) { 
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.formLogin = new FormGroup({      
      passUser: new FormControl('', [Validators.required]),
      emailUser: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)])
    });
  }

  ngOnInit() {
    console.log("menuuuuuu");
    
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

    /**
   * Metodo para loguear un usuario en la app.
   * @param loginForm 
   */
  async loginUser(): Promise<void> {

    this.loading = await this.loadingCtrl.create({      
      duration: 1000,
      message: "Iniciando Sesion"
    });
    await this.loading.present();

 /*   this.loginService.loginUser(this.emailUser, this.passUser).then(
      respuesta => {
        console.log(respuesta);*/
        
        this.loading.dismiss().then(() => {
          window.sessionStorage.setItem("usuarioLogueado", "true"); //variable de session para guardar si el usuario esta logueado
          console.log("iniciar sesion: esLogueado: " + window.sessionStorage.getItem("usuarioLogueado"));
          this.router.navigateByUrl('usuarioLogueado');
        });
      //},
     /*error => {
        this.loading.dismiss().then(async () => {
          const alert = await this.alertCtrl.create({
            message: error.message,
            buttons: [{ text: 'Ok', role: 'cancel' }],
          });
          await alert.present();
        });
      }
    );  */  
}

}
