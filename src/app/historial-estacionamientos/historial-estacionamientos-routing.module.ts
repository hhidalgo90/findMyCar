import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialEstacionamientosPage } from './historial-estacionamientos.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialEstacionamientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialEstacionamientosPageRoutingModule {}
