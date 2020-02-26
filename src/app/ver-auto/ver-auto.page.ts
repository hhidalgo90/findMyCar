import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import {
  NativeGeocoder,
  NativeGeocoderOptions
} from "@ionic-native/native-geocoder/ngx";
import { ModalController } from "@ionic/angular";
import { ModalComoLlegarPage } from "../modal-como-llegar/modal-como-llegar.page";
import { Router } from '@angular/router';
import { EstilosMapaService } from '../services/estilos-mapa.service';

declare var google;

@Component({
  selector: "app-ver-auto",
  templateUrl: "./ver-auto.page.html",
  styleUrls: ["./ver-auto.page.scss"]
})
export class VerAutoPage extends EstilosMapaService {
  @ViewChild("map", { static: false }) mapElement: ElementRef;
  map: any;
  ubicacionAuto: any;
  mIubicacion: string;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  rutas: any;
  mostrarBtnCalcular: boolean;
  mostrarBtnLlegar: boolean = false;
  tipoMovilizacion: string;
  mostrarMarcador: boolean = true;
  existeMarcador: boolean;
  marker: any;
  imagen: string;
  mostrarEstacionar: boolean;
  autoEstacionado : boolean;
  esUsuarioLogueado : String;

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public modalController: ModalController,
    private router : Router
  ) {
    super();
    this.mostrarBtnLlegar = false;
    this.mostrarMarcador = true;
    this.existeMarcador = false;
    this.mostrarEstacionar = false;
    this.autoEstacionado = false;
  }

  ngOnInit() {
    this.loadMap();
    this.esUsuarioLogueado = window.sessionStorage.getItem("usuarioLogueado");

  }

  loadMap() {
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        let latLng = new google.maps.LatLng(
          resp.coords.latitude,
          resp.coords.longitude
        );
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: this.estiloMapa,
          mapTypeControl: false,
          fullscreenControl: false
        };
        this.mIubicacion = latLng;

        this.map = new google.maps.Map(
          this.mapElement.nativeElement,
          mapOptions
        );
        this.directionsRenderer.setMap(this.map);
        this.directionsRenderer.setPanel(
          document.getElementById("directionsPanel")
        );

        console.log("mi ubicacion " + latLng.lat() + "--" + latLng.lng());
        
        this.imagen = "../../assets/icon/persona.png";
        this.agregarMarcador(latLng.lat(), latLng.lng());

        console.log("ubicacion auto" + this.ubicacionAuto.lat() + "--" + this.ubicacionAuto.lng());      
        if(this.autoEstacionado){
          this.imagen = "../../assets/icon/car.png";
          this.agregarMarcador(this.ubicacionAuto.lat(), this.ubicacionAuto.lng());
        }

        this.map.addListener("click", event => {
          console.log(event.latLng.lat());
          console.log(event.latLng.lng());
          if (!this.existeMarcador) {
            this.imagen = "../../assets/icon/car.png";
            this.agregarMarcador(event.latLng.lat(), event.latLng.lng());
          }
          //AGREGAR CONDICION PARA QUE SE OCULTE CUANDO NO ES CLIC EN MARCADOR
          //this.map.infowindow().close();
        });

        this.map.addListener("mouseup", event => {
          console.log("evento mouseup");
        
          if(!this.autoEstacionado){
          console.log(event.latLng.lat());
          console.log(event.latLng.lng());
          this.ubicacionAuto = new google.maps.LatLng(
            event.latLng.lat(),
            event.latLng.lng()
          );
          this.mostrarEstacionar = true;
          }

        });
      })
      .catch(error => {
        console.log("Error getting location", error);
      });
  }

  agregarMarcador(lat, long) {
    console.log("agregar marcador");
    console.log(lat, long);
    this.ubicacionAuto = new google.maps.LatLng(lat, long);

    this.marker = new google.maps.Marker({
      map: this.map,
      position: { lat: lat, lng: long },
      title: "Hello World!",
      icon: this.imagen,
      animation: google.maps.Animation.DROP,
      draggable: false
    });
    console.log("crear marker");

    var contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h1 id="firstHeading" class="firstHeading">Tu auto se encuentra aqui!</h1>' +
      '<div id="bodyContent">' +
      "<p>Haz clic en el boton <b> Como llegar </b> situado mas abajo. <br>" +
      "Sigue las instrucciones para llegar a la ubicación de tu vehiculo. </p>" +
      "</div>" +
      "</div>";

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    this.marker.addListener("click", function() {
      infowindow.open(this.map, this.marker);
    });

    this.existeMarcador = true;

    this.marker.setMap(this.map);
  }

  cambiarRuta() {
    console.log("calcular ruta" + this.tipoMovilizacion);
    this.mostrarBtnLlegar = true;
    this.mostrarMarcador = false;

    //var selectedMode = document.getElementById('mode').value;
    var request = {
      origin: this.mIubicacion,
      destination: this.ubicacionAuto,
      // Note that JavaScript allows us to access the constant
      // using square brackets and a string value as its
      // "property."
      travelMode: google.maps.TravelMode[this.tipoMovilizacion]
    };
    this.directionsService.route(request, (response, status) => {
      if (status === "OK") {
        console.log(response.routes[0].legs[0].steps[0].instructions);
        //console.log(response.routes.legs.steps);
        this.rutas = response.routes[0];
        console.log(this.rutas);

        this.directionsRenderer.setDirections(response);
      } else {
        console.log("Directions request failed due to " + status);
      }
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalComoLlegarPage,
      componentProps: {
        rutas: this.rutas,
        travelMode: "WALKING"
      },
      mode: "ios",
      cssClass: "modalClass",
      backdropDismiss: false
    });
    return await modal.present();
  }

  estacionarAuto() {
    console.log("estacionar auto");
    this.imagen = "../../assets/icon/car.png";
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        location: this.map.getCenter()
      },
      results => {
        console.log(results);
        this.agregarMarcador(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        
      }
    );
    this.mostrarMarcador = false;
    this.autoEstacionado = true;
  }

  centrarMapa(){
    this.map.panTo(this.mIubicacion);
    this.map.setZoom(15);
  }

  volverHome(){
    this.router.navigateByUrl("/usuarioLogueado");
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
