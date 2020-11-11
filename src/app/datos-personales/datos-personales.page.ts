import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.page.html',
  styleUrls: ['./datos-personales.page.scss'],
})
export class DatosPersonalesPage implements OnInit {
  nombre : any;
  sexo : any;
  edad : any;
  email : any;
  imagenUser : string;


  constructor( private firebaseService: FirebaseService) { 
    this.obtenerDatosUsuario();
  }

  ngOnInit() {
  }


  obtenerDatosUsuario() {
    this.nombre = window.sessionStorage.getItem("nombreUsuarioLogueado");
    let sexoNro = window.sessionStorage.getItem("sexoUsuarioLogueado");
    this.edad = window.sessionStorage.getItem("edadUsuarioLogueado");
    this.email = window.sessionStorage.getItem("emailUsuarioLogueado");
    this.imagenUser = window.sessionStorage.getItem("imagenUsuario");

    if(sexoNro == "1"){
      this.sexo = "Hombre"
    }
    else if(sexoNro == "2"){
      this.sexo = "Mujer"
    }
    else {
      this.sexo = "Otro"
    }
  }

}
