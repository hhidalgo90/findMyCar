import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial-estacionamientos',
  templateUrl: './historial-estacionamientos.page.html',
  styleUrls: ['./historial-estacionamientos.page.scss'],
})
export class HistorialEstacionamientosPage implements OnInit {

  historialEstacionamientos : any[];
  constructor(private firebaseService: FirebaseService, public loadingCtrl: LoadingController,private router : Router) { }

  ngOnInit() {
    this.obtenerHistorialEstacionamientos();
  }


  async obtenerHistorialEstacionamientos(){
    const loading = await this.loadingCtrl.create({      
      duration: 1000,
      message: "Obteniendo historial"
    });
    this.firebaseService.obtenerHistorialEstacionamiento().valueChanges().subscribe(respuesta=>{
      console.log(respuesta);
      this.historialEstacionamientos = respuesta;
      console.log(this.historialEstacionamientos);
      loading.dismiss();
    });
    return await loading.present();
  }

  irHome(){
    this.router.navigateByUrl("/usuarioLogueado");
  }

  irHistorial(){
    this.router.navigateByUrl("/usuarioLogueado/historialEstacionamientos");
  }

  irMapa(){
    this.router.navigateByUrl("/verAuto");
  }
}
