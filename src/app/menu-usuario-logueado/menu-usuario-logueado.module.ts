import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuUsuarioLogueadoPageRoutingModule } from './menu-usuario-logueado-routing.module';

import { MenuUsuarioLogueadoPage } from './menu-usuario-logueado.page';

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
