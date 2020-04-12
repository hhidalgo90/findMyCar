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
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx'
import { AngularFirestore } from 'angularfire2/firestore';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';
import { Device } from '@ionic-native/device/ngx';

@NgModule({
  declarations: [AppComponent, MenuPage, VerAutoPage, ModalComoLlegarPage, ModalRegistresePage, MenuUsuarioLogueadoPage, HistorialEstacionamientosPage],
  entryComponents: [ModalComoLlegarPage, ModalRegistresePage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig) ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    NativeGeocoder,
    FirebaseAuthentication,
    AngularFirestore,
    FirebaseMessaging,
    Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
