import { Component } from '@angular/core';

import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { environment } from '../environments/environment';
import { FirebaseService } from './services/firebase.service';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';
import { Device } from '@ionic-native/device/ngx';

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
    private firebaseService : FirebaseService,
    private firebaseMessaging: FirebaseMessaging,
    private device: Device
  ) {
    this.initializeApp();
    this.esUsuarioLogueado = window.sessionStorage.getItem("usuarioLogueado");
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if(!firebase.apps.length){
        firebase.initializeApp(environment.firebaseConfig);
      }
      this.firebaseMessaging.subscribe("all");
      if(this.device.platform != null){
      this.device.platform == "Android"
        ? this.initializeFirebaseAndroid()
        : this.initializeFirebaseIOS();
      }
    });
  }

  initializeFirebaseAndroid() {
    console.log("PUSHER Android subscribe");
    this.firebaseMessaging.subscribe("android");
    this.firebaseMessaging.getToken().then(token => {
      console.log(token);
      
    });    
    this.firebaseMessaging.onTokenRefresh().subscribe(token => {});
    this.firebaseMessaging.onMessage().subscribe(message => {
      console.log("onMessage");      
      console.log(message);      
    });
  }
  initializeFirebaseIOS() {
    console.log("PUSHER IOS subscribe");
    this.firebaseMessaging.subscribe("ios");
    this.firebaseMessaging.requestPermission()
      .then(() => {
        this.firebaseMessaging.getToken().then(token => {});
        this.firebaseMessaging.onTokenRefresh().subscribe(token => {});
      })
      .catch(error => {
        console.log(error);
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
