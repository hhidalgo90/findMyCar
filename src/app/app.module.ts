import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MenuPage } from './menu/menu.page';
import { VerAutoPage } from './ver-auto/ver-auto.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { ModalComoLlegarPage } from './modal-como-llegar/modal-como-llegar.page';
import { ModalRegistresePage } from './modal-registrese/modal-registrese.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuUsuarioLogueadoPage } from './menu-usuario-logueado/menu-usuario-logueado.page';
import { HistorialEstacionamientosPage } from './historial-estacionamientos/historial-estacionamientos.page';
import { RegistroUsuarioPage } from './registro-usuario/registro-usuario.page';
import { SubirImagenPerfilPage } from "./subir-imagen-perfil/subir-imagen-perfil.page";
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx'
import { AngularFirestore } from 'angularfire2/firestore';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { Firebase } from '@ionic-native/firebase/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { Sim } from '@ionic-native/sim/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Camera } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { DatosPersonalesPage } from "./datos-personales/datos-personales.page";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const headers = {
  'Content-Type': 'application/json; charset=UTF-8',
  'Accept': '*/*',
  'X-Requested-With': 'XMLHttpRequest',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
};
const config: SocketIoConfig = { url: 'http://localhost:8090', options: {} };

@NgModule({
  declarations: [AppComponent, MenuPage, VerAutoPage, ModalComoLlegarPage, ModalRegistresePage, MenuUsuarioLogueadoPage, HistorialEstacionamientosPage, RegistroUsuarioPage, SubirImagenPerfilPage, DatosPersonalesPage],
  entryComponents: [ModalComoLlegarPage, ModalRegistresePage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), HttpClientModule, SocketIoModule.forRoot(config) ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    NativeGeocoder,
    FirebaseAuthentication,
    AngularFirestore,
    FirebaseMessaging,
    Device,
    Insomnia,
    Firebase,
    FCM,
    SMS,
    Sim,
    AndroidPermissions,
    HTTP,
    HttpClient,
    Camera,
    ImagePicker,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
