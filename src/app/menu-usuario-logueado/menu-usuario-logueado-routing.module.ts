import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuUsuarioLogueadoPage } from './menu-usuario-logueado.page';

const routes: Routes = [
  {
    path: '',
    component: MenuUsuarioLogueadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuUsuarioLogueadoPageRoutingModule {}
