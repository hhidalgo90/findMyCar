import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { LoadingController } from "@ionic/angular";
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: "app-historial-estacionamientos",
  templateUrl: "./historial-estacionamientos.page.html",
  styleUrls: ["./historial-estacionamientos.page.scss"],
})
export class HistorialEstacionamientosPage implements OnInit {
  historialEstacionamientos: any[];
  sinDatos: boolean = false;

  constructor(
    public firebaseService: FirebaseService,
    public loadingCtrl: LoadingController,
    private router: Router
  ) {
    console.log("[constructor] Inicio");
    this.obtenerHistorialEstacionamientos();
  }

  ngOnInit() {}

  async obtenerHistorialEstacionamientos() {
    console.log("[obtenerHistorialEstacionamientos] Inicio");

    const loading = await this.loadingCtrl.create({
      duration: 1000,
      message: "Obteniendo historial",
    });
    this.firebaseService
      .obtenerHistorialEstacionamiento()
      .valueChanges()
      .subscribe((respuesta) => {
        console.log(respuesta);
        this.historialEstacionamientos = respuesta;

        if (this.historialEstacionamientos.length > 0) {
          console.log(this.historialEstacionamientos);
          this.ordenarHistorial(this.historialEstacionamientos);
          this.formatearFecha(this.historialEstacionamientos);
        } else {
          this.sinDatos = true;
        }
        loading.dismiss();
      });
    return await loading.present();
  }

  irHome() {
    console.log("ir home");

    this.router.navigateByUrl("/usuarioLogueado");
  }

  irHistorial() {
    this.router.navigateByUrl("/usuarioLogueado/historialEstacionamientos");
  }

  irMapa() {
    this.router.navigateByUrl("/verAuto");
  }

  mostrarEnMapa(item) {
    console.log(item);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        latitud: item.latitud,
        longitud: item.longitud,
        id: item.id,
      },
    };
    this.router.navigate(["verAuto"], navigationExtras);
  }

  /**
   * Metodo que obtiene evento de scroll en el content.
   */
  doInfinite(infiniteScrollEvent) {
    infiniteScrollEvent.target.complete();
  }

  /**
   * Metodo que ordena el arreglo de preguntas por el id de la pregunta en orden ascendente.
   * @param listaPreguntas
   */
  ordenarHistorial(historialEstacionamientos: Object[]): any {
    if (
      !historialEstacionamientos ||
      historialEstacionamientos === undefined ||
      historialEstacionamientos.length === 0
    )
      return null;

    historialEstacionamientos.sort((a: any, b: any) => {
      if (a.fechaEstacionamiento > b.fechaEstacionamiento) {
        return -1;
      } else if (a.fechaEstacionamiento < b.fechaEstacionamiento) {
        return 1;
      } else {
        return 0;
      }
    });
    return historialEstacionamientos;
  }

  /**
   * Formatea fecha, convierte numero mes en texto, ej: 14 abril 2020
   * @param historialEstacionamientos
   */
  formatearFecha(historialEstacionamientos: Object[]) {
    historialEstacionamientos.forEach(function (element: any) {
      console.log(element.fechaEstacionamiento);

      var diaMesAnio = element.fechaEstacionamiento.split("/");
      let mes = diaMesAnio[0];
      let dia = diaMesAnio[1];
      let anio = diaMesAnio[2];
      let descripcionMes = "";

      switch (mes) {
        case "01":
          descripcionMes = "Enero";
          break;
        case "02":
          descripcionMes = "Febrero";
          break;
        case "03":
          descripcionMes = "Marzo";
          break;
        case "04":
          descripcionMes = "Abril";
          break;
        case "05":
          descripcionMes = "Mayo";
          break;
        case "06":
          descripcionMes = "Junio";
          break;
        case "07":
          descripcionMes = "Julio";
          break;
        case "08":
          descripcionMes = "Agosto";
          break;
        case "09":
          descripcionMes = "Septiembre";
          break;
        case "10":
          descripcionMes = "Octubre";
          break;
        case "11":
          descripcionMes = "Noviemnre";
          break;
        case "12":
          descripcionMes = "Diciembre";
          break;

        default:
        descripcionMes = "Enero";
      }

      element.fechaEstacionamiento = dia + " de " + descripcionMes + " de " + anio

    });
  }
}
