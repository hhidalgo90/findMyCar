import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import {
  NativeGeocoder,
  NativeGeocoderOptions
} from "@ionic-native/native-geocoder/ngx";
import { ModalController } from "@ionic/angular";
import { ModalComoLlegarPage } from "../modal-como-llegar/modal-como-llegar.page";
import { Router, ActivatedRoute } from '@angular/router';
import { EstilosMapaService } from '../services/estilos-mapa.service';
import { FirebaseService } from '../services/firebase.service';
import { Observable } from 'rxjs';

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
  latitud : Number;
  longitud: Number;

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public modalController: ModalController,
    private router : Router,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute
  ) {
      super();
      this.mostrarBtnLlegar = false;
      this.mostrarMarcador = true;
      this.existeMarcador = false;
      this.mostrarEstacionar = false;
      this.autoEstacionado = false;

      this.route.queryParams.subscribe(params => {
        console.log("params");
        console.log(params.latitud);
        console.log(params.longitud);
        this.latitud = +params.latitud;
        this.longitud = +params.longitud;

        if (params && params.latitud && params.longitud) {
          let latLng = new google.maps.LatLng(
            +params.latitud,
            +params.longitud
          );
          this.imagen = "../../assets/icon/car.png";
          this.agregarMarcador(latLng.lat(), latLng.lng());
        }
      });
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
          console.log(event);
          
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
    let centrarMap = new google.maps.LatLng(lat, long);

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
        console.log(results[0].formatted_address);
        
        this.agregarMarcador(results[0].geometry.location.lat(), results[0].geometry.location.lng());

        this.firebaseService.guardarPuntoEstacionamiento(results[0].geometry.location.lat() , results[0].geometry.location.lng(), results[0].formatted_address).then(resp=>{
          console.log("ubicacion vehiculo guardado con exito en firebase");
          
        }).catch(error=>{
          console.log("ocurrio un error al guardar ubicacion del vehiculo en firebase: " + error);
          
        });  


          // Call subscribe() to start listening for updates.
          const locationsSubscription = this.obtenerDistanciaEntrePuntos(results[0]).subscribe({
            next(distanciaEntrePuntos) {
              console.log("Distancia entre los puntos: ", distanciaEntrePuntos);
              if(distanciaEntrePuntos>1){
                console.log("te estan pelando el toco");
                
              }
            },
            error(msg) {
              console.log("Error Getting Location: ", msg);
            }
          });
    
          // Stop listening for location after 10 seconds
          /*setTimeout(() => {
            locationsSubscription.unsubscribe();
          }, 10000);*/
        
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



  obtenerDistanciaEntrePuntos(results : any): Observable<any>{

  // Create an Observable that will start listening to geolocation updates
// when a consumer subscribes.
const locations = new Observable((observer) => {
  let watchId: number;

  // Simple geolocation API check provides values to publish
  if ('geolocation' in navigator) {
    watchId = navigator.geolocation.watchPosition((position: Position) => {

      let distanciaEntrePuntos = getDistanceFromLatLonInKm(position.coords.latitude,position.coords.longitude ,results.geometry.location.lat(),results.geometry.location.lng());

      observer.next(distanciaEntrePuntos);
    }, (error: PositionError) => {
      observer.error(error);
    });
  } else {
    observer.error('Geolocation not available');
  }

  // When the consumer unsubscribes, clean up data ready for next subscription.
  return {
    unsubscribe() {
      navigator.geolocation.clearWatch(watchId);
    }
  };

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
});
return locations;
}



}
