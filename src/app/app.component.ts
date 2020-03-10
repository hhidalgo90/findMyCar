import { Component } from '@angular/core';

import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { environment } from '../environments/environment';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public navigate  =
  [    
    {
      title : "Contacts",
      url   : "/contacts",
      icon  : "contacts"
    },
  ]
  public esUsuarioLogueado : String;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private loadingCtrl : LoadingController,
    private firebaseService : FirebaseService
  ) {
    this.initializeApp();
    this.esUsuarioLogueado = window.sessionStorage.getItem("usuarioLogueado");
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      firebase.initializeApp(environment.firebaseConfig);
    });
  }

  async cerrarSesion(){
    const loading = await this.loadingCtrl.create({      
      duration: 1000,
      message: "Cerrando Sesion"
    });
    await loading.present();
    this.firebaseService.logoutUser().then(()=>{
      loading.dismiss();
      console.log("llegue a cerrar sesion");
      window.sessionStorage.setItem("usuarioLogueado" , "false");
      this.router.navigateByUrl("/menuApp");
    });

    return await loading.present();
  }

  esLogueado(){    
    var usuarioLogueado = window.sessionStorage.getItem("usuarioLogueado");
    if(usuarioLogueado == "true"){
      return true;
    }
    else{
      return false;
    }
  }
}
