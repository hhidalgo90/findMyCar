import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalComoLlegarPage } from './modal-como-llegar.page';

const routes: Routes = [
  {
    path: '',
    component: ModalComoLlegarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalComoLlegarPageRoutingModule {}
