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
import { FCM } from '@ionic-native/fcm/ngx';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';

declare var cordova: Cordova;
declare var window;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public navigate  =
  [    
    {
      title : "Mis datos",
      url   : "/datos-personales",
      icon  : "contacts"
    },
  ]
  public esUsuarioLogueado : String;
  public nombreUsuario : string;
  public sexoUsuario : number;
  public imagen : string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private loadingCtrl : LoadingController,
    private firebaseService : FirebaseService,
    private firebaseMessaging: FirebaseMessaging,
    private device: Device,
    private fcm: FCM,
    private backgroundGeolocation: BackgroundGeolocation
  ) {
    this.initializeApp();
    this.esUsuarioLogueado = window.sessionStorage.getItem("usuarioLogueado");
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      console.log("antes de iniciar seguimiento segundo plano");      
      this.activarSeguimiendoSegundoplano();

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
    this.fcm.subscribeToTopic("android");
    this.fcm.getToken().then(token => {
      console.log(token);
      window.sessionStorage.setItem("token" , token);
      
    });    
    this.firebaseMessaging.onTokenRefresh().subscribe(token => {});

    this.fcm.onNotification().subscribe(data => {
      console.log("onNotification");
      console.log(data);
      
    });

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
        this.firebaseMessaging.getToken().then(token => {
          window.sessionStorage.setItem("token" , token);
        });
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
      window.sessionStorage.setItem("nombreUsuarioLogueado" , "");
      window.sessionStorage.setItem("sexoUsuarioLogueado" , "");
      this.nombreUsuario = "";
      this.sexoUsuario = 0;
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

  menuAbierto(){
    this.nombreUsuario = window.sessionStorage.getItem("nombreUsuarioLogueado");
    this.sexoUsuario = +window.sessionStorage.getItem("sexoUsuarioLogueado");
    console.log("datos usuario logueado");
    
    if(this.sexoUsuario == 1){ //1 = hombre
      this.imagen = "../../assets/avatar/hombre.jpg";
    }else{
      this.imagen = "../../assets/avatar/mujer.jpg";
    }
    
  }


  activarSeguimiendoSegundoplano(){
    console.log("[activarSeguimiendoSegundoplano] Inicio");
    
      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // enable this to clear background location settings when the app terminates
        notificationTitle: 'Background tracking',
        notificationText: 'enabled'
    };
    
    
    this.backgroundGeolocation.configure(config)
      .then(() => {
    
        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
          console.log("location");
          console.log(location);
          this.backgroundGeolocation. startTask().then(taks => {
            console.log("Star task:");
            console.log(taks);
            
            
          }).catch(error =>{
            console.log("Star task [ERROR]" + error);
            
          });
          
    
          // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
          this.backgroundGeolocation.finish(); // FOR IOS ONLY
        });
    
        this.backgroundGeolocation.on(BackgroundGeolocationEvents.stationary).subscribe(resp => {
          console.log("stationary");
          console.log(resp);
          
          
        });

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.start).subscribe(resp => {
          console.log('[INFO] BackgroundGeolocation service has been started');         
        });

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.stop).subscribe(resp => {
          console.log('[INFO] BackgroundGeolocation service has been stopped');          
        });

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.authorization).subscribe(resp => {
          console.log("Status autorizacion background: " + resp);

          this.backgroundGeolocation.checkStatus().then(status => {
            if(status){
              setTimeout(function() {
                var showSettings = confirm('App requires location tracking permission. Would you like to open app settings?');
                if (showSettings) {
                  return this.backgroundGeolocation.showAppSettings();
                }
              }, 1000);
            }
          });
          
        })
    
      });
      window.app = this;
      console.log("[activarSeguimiendoSegundoplano] Fin");
    }

}
