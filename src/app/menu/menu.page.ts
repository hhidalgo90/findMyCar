import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController  } from "@ionic/angular";
import { ModalRegistresePage } from '../modal-registrese/modal-registrese.page';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  emailUser = "";
  passUser = "";
  emailSession = "";
  passSession = "";
  formLogin : FormGroup;
  formInicioSesion: FormGroup;
  mostrarEmailPass : boolean;
  mostrarOpcionesLogin : boolean;
  public loading: HTMLIonLoadingElement;

  constructor(public modalController: ModalController, public loadingCtrl: LoadingController, private router: Router, private firebaseService : FirebaseService, public alertCtrl: AlertController) { 
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.formLogin = new FormGroup({      
      passUser: new FormControl('', [Validators.required]),
      emailUser: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)])
    });

    this.formInicioSesion = new FormGroup({
      emailSession: new FormControl('', [Validators.required, Validators.email]),
      passSession: new FormControl('', [Validators.required])
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

    this.firebaseService.loginUser(this.emailSession, this.passSession).then(
      respuesta => {
        console.log(respuesta);
        console.log(respuesta.additionalUserInfo.isNewUser);
        let navigationExtras: NavigationExtras = {
          queryParams: {
            esUsuarioNuevo : respuesta.additionalUserInfo.isNewUser
          }
        };
        
        this.loading.dismiss().then(() => {
          window.sessionStorage.setItem("usuarioLogueado", "true"); //variable de session para guardar si el usuario esta logueado
          console.log("iniciar sesion: esLogueado: " + window.sessionStorage.getItem("usuarioLogueado"));

          this.router.navigate(['usuarioLogueado'], navigationExtras);
        });
      },
     error => {
        this.loading.dismiss().then(async () => {
          const alert = await this.alertCtrl.create({
            message: error.message,
            buttons: [{ text: 'Ok', role: 'cancel' }],
          });
          await alert.present();
        });
      }
    );  
}

async registrarUsuario(): Promise<void> {
  console.log("registrarUsuario");
  this.loading = await this.loadingCtrl.create({      
    duration: 1000,
    message: "Registrando usuario.."
  });
  await this.loading.present();
  
  this.firebaseService.registrarUsuario(this.emailUser, this.passUser).then(resp =>{
    console.log(resp);
    console.log(resp.additionalUserInfo.isNewUser);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        esUsuarioNuevo : resp.additionalUserInfo.isNewUser
      }
    };

    this.loading.dismiss().then(() => {      
      window.sessionStorage.setItem("usuarioLogueado", "true"); //variable de session para guardar si el usuario esta logueado
      console.log("Registrar usuario: esLogueado: " + window.sessionStorage.getItem("usuarioLogueado"));

      this.router.navigate(['usuarioLogueado'], navigationExtras);
    });
    
  },
  error => {
    this.loading.dismiss().then(async () => {
      const alert = await this.alertCtrl.create({
        message: error.message,
        buttons: [{ text: 'Ok', role: 'cancel' }],
      });
      await alert.present();
    });
  }); 

}


resetPassword(): void {
  this.firebaseService.resetPassword(this.emailSession).then(
    async () => {
      const alert = await this.alertCtrl.create({
        message: 'Check your email for a password reset link',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            handler: () => {
              this.router.navigateByUrl('menuApp');
            },
          },
        ],
      });
      await alert.present();
    },
    async error => {
      const errorAlert = await this.alertCtrl.create({
        message: error.message,
        buttons: [{ text: 'Ok', role: 'cancel' }],
      });
      await errorAlert.present();
    }
  );
}

}
