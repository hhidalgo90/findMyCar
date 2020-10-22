import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubirImagenPerfilPage } from './subir-imagen-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: SubirImagenPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubirImagenPerfilPageRoutingModule {}
