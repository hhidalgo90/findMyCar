import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { LoadingController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-historial-estacionamientos',
  templateUrl: './historial-estacionamientos.page.html',
  styleUrls: ['./historial-estacionamientos.page.scss'],
})
export class HistorialEstacionamientosPage implements OnInit {

  historialEstacionamientos : any[];
  sinDatos : boolean = false;

  constructor(public firebaseService: FirebaseService, public loadingCtrl: LoadingController,private router : Router) {
    console.log("[constructor] Inicio");
    this.obtenerHistorialEstacionamientos();
    let distanciaEntrePuntos = this.getDistanceFromLatLonInKm(-33.4707183,-70.6160292,-33.4179729,-70.6601669);
    console.log(distanciaEntrePuntos);
    
   }

  ngOnInit() {
  }


  async obtenerHistorialEstacionamientos(){ 
    console.log("[obtenerHistorialEstacionamientos] Inicio");
    
    const loading = await this.loadingCtrl.create({      
      duration: 1000,
      message: "Obteniendo historial"
    });
    this.firebaseService.obtenerHistorialEstacionamiento().valueChanges().subscribe(respuesta=>{
      console.log(respuesta);
      this.historialEstacionamientos = respuesta;
      console.log(this.historialEstacionamientos);
      if(this.historialEstacionamientos.length <= 0){
        this.sinDatos = true;
      }
      loading.dismiss();
    });
    return await loading.present();
  }

  irHome(){
    console.log("ir home");
    
    this.router.navigateByUrl("/usuarioLogueado");
  }

  irHistorial(){
    this.router.navigateByUrl("/usuarioLogueado/historialEstacionamientos");
  }

  irMapa(){
    this.router.navigateByUrl("/verAuto");
  }

  mostrarEnMapa(item){
    console.log(item);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        latitud : item.latitud,
        longitud : item.longitud
      }
    };
    this.router.navigate(["verAuto"],navigationExtras);
    
  }

  /**
 * Metodo que obtiene evento de scroll en el content.
 */
doInfinite(infiniteScrollEvent) {
  infiniteScrollEvent.target.complete();
}

getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
  var dLon = this.deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

deg2rad(deg) {
  return deg * (Math.PI/180)
}
}
