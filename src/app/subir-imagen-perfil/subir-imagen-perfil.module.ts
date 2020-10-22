import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubirImagenPerfilPageRoutingModule } from './subir-imagen-perfil-routing.module';

import { SubirImagenPerfilPage } from './subir-imagen-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubirImagenPerfilPageRoutingModule
  ],
  declarations: [SubirImagenPerfilPage]
})
export class SubirImagenPerfilPageModule {}
