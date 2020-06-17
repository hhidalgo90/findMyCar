import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import {
  NativeGeocoder,
  NativeGeocoderOptions
} from "@ionic-native/native-geocoder/ngx";
import { ModalController, ToastController, LoadingController  } from "@ionic/angular";
import { ModalRegistresePage } from "../modal-registrese/modal-registrese.page";
import { ModalComoLlegarPage } from "../modal-como-llegar/modal-como-llegar.page";
import { Router, ActivatedRoute } from '@angular/router';
import { EstilosMapaService } from '../services/estilos-mapa.service';
import { FirebaseService } from '../services/firebase.service';
import { Observable } from 'rxjs';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { Sim } from '@ionic-native/sim/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { EnviarMensajePushService } from '../services/enviar-mensaje-push.service';

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
  mostrarBtnLlegar: boolean = false;
  tipoMovilizacion: string;
  mostrarMarcador: boolean = true;
  existeMarcador: boolean;
  marker = new google.maps.Marker();
  markerCar = new google.maps.Marker();
  imagen: string;
  mostrarEstacionar: boolean;
  mostrarCentrar: boolean;
  autoEstacionado : boolean;
  esUsuarioLogueado : String;
  latitud : Number;
  longitud: Number;
  arrayMarkers = new Array<any>();
  idItemEstacionar : String;
  historialEstacionamientos : any[];
  validaViaje : any;

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public modalController: ModalController,
    private router : Router,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    public toastController: ToastController,
    public loadingCtrl: LoadingController,
    private insomnia: Insomnia,
    private sim: Sim,
    private sms: SMS,
    private androidPermissions: AndroidPermissions,
    private enviarMensajePushService : EnviarMensajePushService
  ) {
      super();
      this.mostrarBtnLlegar = false;
      this.mostrarMarcador = true;
      this.existeMarcador = false;
      this.mostrarEstacionar = false;
      this.mostrarCentrar = false;
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
          this.idItemEstacionar = params.id;
          this.autoEstacionado = true;
          this.imagen = "../../assets/icon/car.png";
          this.agregarMarcadorAuto(latLng.lat(), latLng.lng());
        }
        /*else {
            this.tieneViajesPendientes();
        }*/

        //mantiene pantalla prendida mientras este en esta pagina.
        this.insomnia.keepAwake().then(
        () => console.log('success'),
        () => console.log('error')
        );
      })
      
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

        this.imagen = "../../assets/icon/persona.png";
        this.agregarMarcador(latLng.lat(), latLng.lng());
      
        if(this.autoEstacionado){
          console.log("ubicacion auto" + this.ubicacionAuto.lat() + "--" + this.ubicacionAuto.lng());  
          this.imagen = "../../assets/icon/car.png";
          this.agregarMarcadorAuto(this.ubicacionAuto.lat(), this.ubicacionAuto.lng());
        }
  
        this.map.addListener("click", event => {
          console.log(event.latLng.lat());
          console.log(event.latLng.lng());
          if (!this.existeMarcador) {
            this.imagen = "../../assets/icon/car.png";
            this.agregarMarcadorAuto(event.latLng.lat(), event.latLng.lng());
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
          this.mostrarCentrar = true;
          }
          });

        this.geolocation.watchPosition().subscribe(resp => {
          if(resp.coords !== undefined && this.marker !== undefined){
            let latLng = new google.maps.LatLng(
              resp.coords.latitude,
              resp.coords.longitude
            );

            //if (resp.coords.speed > 0 && resp.coords.accuracy < 10) {
              console.log("mi ubicacion " + latLng.lat() + "--" + latLng.lng());
              this.marker.setPosition( new google.maps.LatLng(latLng.lat(), latLng.lng() ) )
              //this.map.panTo( new google.maps.LatLng(latLng.lat(), latLng.lng() ) );
            }
            
          //}

        /**
         * Cambia el estilo del mapa segun la hora
         */
        const observadorHora = this.obtenerHora(this.map).subscribe({
          next(estiloMapa) {    
            console.log("Estilo mapa: ");
            console.log(estiloMapa);            
          },
          error(msg) {
            console.log("Error al modificar estilo mapa: ", msg);
          }
        });
        });
      })
      .catch(error => {
        console.log("Error getting location", error);
      });
  }

  agregarMarcador(lat, long) {
    console.log("agregar marcador");
    console.log(lat, long);    

    this.marker = new google.maps.Marker({
      map: this.map,
      position: { lat: lat, lng: long },
      title: "Hello World!",
      icon: this.imagen,
      animation: google.maps.Animation.DROP,
      draggable: false
    });    
    console.log("crear marker");

    let contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h1 id="firstHeading" class="firstHeading">Tu estas aqui!</h1>' +
      '<div id="bodyContent">' +
      "<p>Haz clic en el boton <b> Como llegar </b> situado mas abajo. <br>" +
      "Sigue las instrucciones para llegar a la ubicación de tu vehiculo. </p>" +
      "</div>" +
      "</div>";

    let infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    google.maps.event.addListener(this.marker, 'click', () => {
      console.log("clic marcador");
      
      if (infowindow)
      infowindow.close();

      infowindow.open(this.map, this.marker);
    });
    
    this.arrayMarkers.push(this.marker);

    this.existeMarcador = true;    
    for (var i = 0; i < this.arrayMarkers.length; i++) {
      this.arrayMarkers[i].setMap(this.map);
    }
  }

  agregarMarcadorAuto(lat, long) {
    console.log("agregar marcador auto");
    console.log(lat, long);    

    this.markerCar = new google.maps.Marker({
      map: this.map,
      position: { lat: lat, lng: long },
      title: "Hello World!",
      icon: this.imagen,
      animation: google.maps.Animation.DROP,
      draggable: false
    });    
    console.log("crear marker car");
    this.ubicacionAuto = new google.maps.LatLng(lat, long);
    let contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h1 id="firstHeading" class="firstHeading">Tu auto se encuentra aqui!</h1>' +
      '<div id="bodyContent">' +
      "<p>Haz clic en el boton <b> Como llegar </b> situado mas abajo. <br>" +
      "Sigue las instrucciones para llegar a la ubicación de tu vehiculo. </p>" +
      "</div>" +
      "</div>";

    let infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    google.maps.event.addListener(this.markerCar, 'click', () => {
      console.log("clic marcador");
      
      if (infowindow)
      infowindow.close();

      infowindow.open(this.map, this.markerCar);
    });
    
    this.arrayMarkers.push(this.markerCar);

    this.existeMarcador = true;    
    for (var i = 0; i < this.arrayMarkers.length; i++) {
      this.arrayMarkers[i].setMap(this.map);
    }
  }

  cambiarRuta() {
    console.log("calcular ruta" + this.tipoMovilizacion);
    this.mostrarBtnLlegar = true;
    this.mostrarMarcador = false;

    if(this.directionsRenderer.map == null){
      console.log("directionsRender null");
      
      this.directionsRenderer.setMap(this.map);
    }

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
        this.imagen = "../../assets/icon/car.png";
        this.agregarMarcadorAuto(results[0].geometry.location.lat(), results[0].geometry.location.lng());

        this.firebaseService.guardarPuntoEstacionamiento(results[0].geometry.location.lat() , results[0].geometry.location.lng(), results[0].formatted_address).then(resp=>{
          console.log("ubicacion vehiculo guardado con exito en firebase");
          window.sessionStorage.getItem("idEstacionamiento");
          console.log(window.sessionStorage.getItem("idEstacionamiento"));
          
          
        }).catch(error=>{
          console.log("ocurrio un error al guardar ubicacion del vehiculo en firebase: " + error);
          
        });

        // Call subscribe() to start listening for updates.
        const locationsSubscription = this.obtenerDistanciaEntrePuntos(results[0]).subscribe({
          next(distanciaEntrePuntos) {
            console.log("Distancia entre los puntos: ");
            console.log(distanciaEntrePuntos);
            
            if(distanciaEntrePuntos > 0.1){
              alert("te estan pelando el toco");
              locationsSubscription.unsubscribe();
              if(this.esLogueado){
                console.log("estoy logueado");
                
              }
            }
          },
          error(msg) {
            console.log("Error Getting Location: ", msg);
          }
        });
      }
    );
    this.mostrarMarcador = false;
    this.autoEstacionado = true;

    this.enviarMensajePushService.enviarMensajePush().subscribe(resp => {
      console.log("enviarMensajePush");      
      console.log(resp);      
    });

  }

  centrarMapa(){
    this.map.panTo(this.mIubicacion);
    this.map.setZoom(15);
  }

  limpiarMapa(estacionarAuto : boolean){
    console.log("limpiar mapa");
    console.log(this.arrayMarkers);    
    for(var i = 0 ; i < this.arrayMarkers.length; i++){
      console.log(this.arrayMarkers[i].icon.substring(this.arrayMarkers[i].icon.length - 7, this.arrayMarkers[i].icon.length));
      if(this.arrayMarkers[i].icon.substring(this.arrayMarkers[i].icon.length - 7, this.arrayMarkers[i].icon.length) == "car.png"){
        console.log("soy auto");
        this.arrayMarkers[i].setMap(null);
       
      }
    }
    this.arrayMarkers = [];
    
    this.mostrarEstacionar= false;
    this.mostrarCentrar = false;
    this.mostrarBtnLlegar = false;
    this.autoEstacionado = false;
    this.mostrarMarcador = true;
    this.directionsRenderer.setMap(null);
    this.centrarMapa();
    if(estacionarAuto){
      console.log("Estacionar vehiculo");      
      let idEstacionamiento = (this.idItemEstacionar!= null && this.idItemEstacionar != "") ? this.idItemEstacionar : window.sessionStorage.getItem("idEstacionamiento");
      this.firebaseService.estacionarVehiculo(idEstacionamiento).then(async ()=>{
        console.log("Auto recuperado con exito");
        //this.sendSms();
        this.idItemEstacionar = "";
        const toast = await this.toastController.create({
          message: 'Vehiculo recuperado con exito.',
          duration: 2000,
          position: 'top',
          color: "success"
        });
        toast.present();
      })
      .catch(async error=>{
        console.error("Ocurrio un error al recuperar el auto");
        const toast = await this.toastController.create({
          message: 'Ocurrio un error al recuperar el vehiculo.',
          duration: 2000,
          position: 'top',
          color: "danger"
        });
        toast.present();
      });
    }
  }

  volverHome(){
    //Permito que se apague la pantalla una vez salgo de la pagina.
    this.insomnia.allowSleepAgain().then(
      () => console.log('success'),
      () => console.log('error'));
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


  /**
   * Funcion que retorna un observable con la distancia entre dos puntos.
   * @param results 
   */
  obtenerDistanciaEntrePuntos(ubicacionVehiculo : any): Observable<any> {
    console.log("obtenerDistanciaEntrePuntos : " + ubicacionVehiculo);
    
  // Create an Observable that will start listening to geolocation updates
// when a consumer subscribes.
const locations = new Observable((observer) => {
  let swatchId: number;

  const watchId  = this.geolocation.watchPosition().subscribe(position => {
  console.log(position.coords.longitude + ' ' + position.coords.latitude);
  let distanciaEntrePuntos = getDistanceFromLatLonInKm(position.coords.latitude,position.coords.longitude ,ubicacionVehiculo.geometry.location.lat(),ubicacionVehiculo.geometry.location.lng());
  observer.next(distanciaEntrePuntos);
});


  // When the consumer unsubscribes, clean up data ready for next subscription.
  return {
    unsubscribe() {
      watchId.unsubscribe();
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

async tieneViajesPendientes(){
  console.log("[tieneViajesPendientes] Inicio");
  //let validaViaje = false;
  const loading = await this.loadingCtrl.create({      
    duration: 1000,
    message: "Comprobando"
  });
  const suscriptor = this.firebaseService.obtenerHistorialEstacionamiento().valueChanges().subscribe(respuesta=>{
    console.log(respuesta);
    this.historialEstacionamientos = respuesta;
    console.log(this.historialEstacionamientos);
    if(this.historialEstacionamientos.length > 0){
      for(var i = 0; i < this.historialEstacionamientos.length; i++){
        if(this.historialEstacionamientos[i].autoEstacionado == true){
          this.validaViaje = true;
          break;
        }
      }
    }
    console.log(this.validaViaje);
    if(this.validaViaje){
      this.mostrarModalPendiente();
      this.validaViaje = false;
      suscriptor.unsubscribe();
    }
    else{
      this.estacionarAuto();
      suscriptor.unsubscribe();
    }
    
    loading.dismiss();
  });
  return await loading.present();
  
}

async mostrarModalPendiente() {
  const modal = await this.modalController.create({
    component: ModalRegistresePage,
    componentProps: {
      texto: "Hemos detectado que tiene un viaje pendiente de cierre, favor dirigase al modulo Historial' y finalice el viaje"
    },
    mode: "ios",
    cssClass: "modalClass2",
    backdropDismiss: false
  });
  return await modal.present();
}

sendSms(){
  console.log("sendSMS");
  
  /*this.sim.getSimInfo().then(
    (info) => console.log('Sim info: ', info),
    (err) => console.log('Unable to get sim info: ', err)
  );
  
  this.sim.hasReadPermission().then(
    (info) => console.log('Has permission: ', info)
  );
  
  this.sim.requestReadPermission().then(
    () => console.log('Permission granted'),
    //() => console.log('Permission denied')
  );*/
    console.log("antes de enviar sms");

    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS);
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
    );

  this.sms.hasPermission().then(data => {
    console.log(data);
    if(data){
      var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
            intent: 'INTENT'  // send SMS with the native android SMS messaging
            //intent: '' // send SMS without opening any other app
        }
    };
      this.sms.send('962234900', 'Su vehiculo fue recuperado con exito', options);
      this.sms.send('962234900', 'Su vehiculo fue recuperado con exito', options).then(data => {
        console.log(data);    
      });
    }
    else {
      console.log("Usuario no dio permisos para enviar sms");      
    }    
  });
}
}
