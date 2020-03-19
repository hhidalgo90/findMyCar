import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-usuario-logueado',
  templateUrl: './menu-usuario-logueado.page.html',
  styleUrls: ['./menu-usuario-logueado.page.scss'],
})
export class MenuUsuarioLogueadoPage implements OnInit {
  
  esUsuarioNuevo : boolean;

  constructor(private route: ActivatedRoute, private router: Router) {
    console.log("constructor menu user logeado");
    
    this.route.queryParams.subscribe(params => {
      if (params && params.esUsuarioNuevo) {
        this.esUsuarioNuevo = params.esUsuarioNuevo;
        console.log("es usuario nuevo: " + this.esUsuarioNuevo);
        
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
}
