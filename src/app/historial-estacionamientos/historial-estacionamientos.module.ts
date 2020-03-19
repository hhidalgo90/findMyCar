import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialEstacionamientosPageRoutingModule } from './historial-estacionamientos-routing.module';

import { HistorialEstacionamientosPage } from './historial-estacionamientos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialEstacionamientosPageRoutingModule
  ],
  declarations: [HistorialEstacionamientosPage]
})
export class HistorialEstacionamientosPageModule {}
