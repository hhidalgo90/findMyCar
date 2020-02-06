import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalRegistresePage } from './modal-registrese.page';

const routes: Routes = [
  {
    path: '',
    component: ModalRegistresePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalRegistresePageRoutingModule {}
