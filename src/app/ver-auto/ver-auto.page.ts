import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
 
declare var google;

@Component({
  selector: 'app-ver-auto',
  templateUrl: './ver-auto.page.html',
  styleUrls: ['./ver-auto.page.scss'],
})
export class VerAutoPage implements OnInit {
  @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;
  address:string;

  constructor(private geolocation: Geolocation,private nativeGeocoder: NativeGeocoder) { }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('click',(event) => {       
        console.log(event.latLng.lat());
        console.log(event.latLng.lng());
        this.agregarMarcador(event.latLng.lat(), event.latLng.lng());
    });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  } 

  agregarMarcador(lat,long){
    console.log("agregar marcador");
    console.log(lat , long);
    
    
    let image = '../../assets/icon/car.png';
    var marker = new google.maps.Marker({
      map: this.map,
      position: {lat: lat , lng: long},
        title:"Hello World!",
        icon: image          
    });
    console.log("crear marker");      
    marker.setMap(this.map);
  }

}
