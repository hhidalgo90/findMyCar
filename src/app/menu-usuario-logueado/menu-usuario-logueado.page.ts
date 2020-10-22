import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-menu-usuario-logueado',
  templateUrl: './menu-usuario-logueado.page.html',
  styleUrls: ['./menu-usuario-logueado.page.scss'],
})
export class MenuUsuarioLogueadoPage implements OnInit {
  
  esUsuarioNuevo : boolean;
  datosUsuario : any;

  constructor(private route: ActivatedRoute, private router: Router,  private firebaseService : FirebaseService) {
    console.log("constructor menu user logeado");
    
    this.route.queryParams.subscribe(params => {
      if (params && params.esUsuarioNuevo) {
        this.esUsuarioNuevo = params.esUsuarioNuevo;
        console.log("es usuario nuevo: " + this.esUsuarioNuevo);

        this.obtenerDatosUsuario();
        
      }
    });
   }

  ngOnInit() {
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

  obtenerDatosUsuario(){
    console.log("obtenerDatosUsuario");
    
    this.firebaseService.obtenerDatosUsuario().valueChanges().subscribe(resp => {
      if(resp != undefined){
        console.log(resp);
        this.datosUsuario = resp;  
        console.log(this.datosUsuario);
        window.sessionStorage.setItem("nombreUsuarioLogueado" , this.datosUsuario.nombre);
        window.sessionStorage.setItem("sexoUsuarioLogueado" , this.datosUsuario.sexo);
      }

      
    });
  }
}
