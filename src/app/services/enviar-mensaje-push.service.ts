import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EnviarMensajePushService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization' : 'key=AAAAoNYf5Zw:APA91bHh7uoVGEg8X5VUDGaL2o6FxhtFq6gYwB79wbf7POGbK2SXymPIz3I00inoGzjjZKd6cdED8UZjlxQ89Whp2nZnopNIDa0rsBHOnUIW8Vl_Z_Fc0hzHX9bgTtBNsuvnfctYQmI1'
    })
  }
  body : any;
  constructor(private http: HttpClient) { }

  enviarMensajePush() : Observable<any> {
    console.log("[enviarMensajePush]");
    let token = window.sessionStorage.getItem("token");

    this.body = {
      "notification":{
        "title":"Alerta de robo de vehiculo",
        "body":"Hemos detectado que tu vehiculo estacionado esta en movimiento, favor revisa",
        "sound":"default",
        "icon":"fcm_push_icon"
      },
      "data":{
        "landing_page":"respuestaPush",
        "price":"$3,000.00"
      },
        "to": token,
        "priority":"high",
        "restricted_package_name":""
    }
    console.log("[enviarMensajePush] Antes de enviar mensaje");
    return this.http.post('https://fcm.googleapis.com/fcm/send', JSON.stringify(this.body), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

    // Handle API errors
    handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      // return an observable with a user-facing error message
      return throwError(
        'Something bad happened; please try again later.');
    };
}
