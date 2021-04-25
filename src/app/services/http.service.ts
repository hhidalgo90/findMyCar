import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  body : any;

  constructor(private http: HttpClient) { }

  guardarPuntoEstacionamiento(latitud : string , longitud : string, direccion : string){
    console.log("[FirebaseService] [guardarPuntoEstacionamiento] " + latitud + " " + longitud);
    let nombreUsuario = window.sessionStorage.getItem("nombreUsuarioLogueado");
    let sexoUsuario = window.sessionStorage.getItem("sexoUsuarioLogueado");
    let edadUsuario = window.sessionStorage.getItem("edadUsuarioLogueado");
    let emailUsuario = window.sessionStorage.getItem("emailUsuarioLogueado");
    let idUser = window.sessionStorage.getItem("idUser");
    let lat = +latitud;
    let lng = +longitud;

    this.body = 
    '{' + 
    ' "latitud"    : '+ lat +',' +
     '"longitud"   :' + lng +  ',' + 
     '"direccionEstacionada"   :' + direccion +  ','  +
     '"terminado"  :' + 0 +  ','+
     '"nombreUser" :' + nombreUsuario +  ',' +
     '"emailUser"  :' + emailUsuario +  ',' +
     '"sexoUser"   :' + sexoUsuario +  ',' +
     '"edadUser"   :' + edadUsuario +  ',' +
     '"idUser"     :' + idUser +  ',' +
     ' }';
  
    //return this.http.post('https://gpscar-d23cb.appspot.com/stream-sse-mvc/guardarEstacionamiento', this.body, this.httpOptions ).subscribe(resp => {
    return this.http.post('http://localhost:8089/guardarEstacionamiento', this.body, this.httpOptions ).subscribe(resp => {
      console.log(resp);
      
    });

  }
}
