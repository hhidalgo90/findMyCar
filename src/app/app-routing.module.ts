import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MenuPage } from './menu/menu.page';
import { VerAutoPage } from './ver-auto/ver-auto.page';
import { MenuUsuarioLogueadoPage } from './menu-usuario-logueado/menu-usuario-logueado.page';
import { HistorialEstacionamientosPage } from './historial-estacionamientos/historial-estacionamientos.page';
import { RegistroUsuarioPage } from './registro-usuario/registro-usuario.page';
import { SubirImagenPerfilPage } from "./subir-imagen-perfil/subir-imagen-perfil.page";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  { path: 'menuApp', component : MenuPage },
  { path: 'verAuto', component : VerAutoPage },
  {
    path: 'modal-como-llegar',
    loadChildren: () => import('./modal-como-llegar/modal-como-llegar.module').then( m => m.ModalComoLlegarPageModule)
  },
  {
    path: 'modal-registrese',
    loadChildren: () => import('./modal-registrese/modal-registrese.module').then( m => m.ModalRegistresePageModule)
  },
  {
    path: 'usuarioLogueado', component : MenuUsuarioLogueadoPage 
  },  
  {
    path: 'usuarioLogueado/verAuto', component : VerAutoPage 
  },
  {
    path: 'usuarioLogueado/historialEstacionamientos', component : HistorialEstacionamientosPage
  },
  {
    path: 'registroUsuario', component : RegistroUsuarioPage
  },
  {
    path: 'subirImagenPerfil', component : SubirImagenPerfilPage
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
