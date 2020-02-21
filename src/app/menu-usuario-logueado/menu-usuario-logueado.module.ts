import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuUsuarioLogueadoPageRoutingModule } from './menu-usuario-logueado-routing.module';

import { MenuUsuarioLogueadoPage } from './menu-usuario-logueado.page';
import { VerAutoPage } from '../ver-auto/ver-auto.page';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'usuarioLogueado',
    component: MenuUsuarioLogueadoPage, 
    children:[
        { path: 'usuarioLogueado/verAuto', component : VerAutoPage },
        { path: 'tab2', loadChildren: '../tab2/tab2.module#Tab2PageModule' },
    ]
  },
  {
    path:'',
    redirectTo:'/usuarioLogueado',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuUsuarioLogueadoPageRoutingModule
  ],
  declarations: [MenuUsuarioLogueadoPage]
})
export class MenuUsuarioLogueadoPageModule {}
