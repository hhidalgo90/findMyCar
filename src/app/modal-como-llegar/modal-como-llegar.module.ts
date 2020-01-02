import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalComoLlegarPageRoutingModule } from './modal-como-llegar-routing.module';

import { ModalComoLlegarPage } from './modal-como-llegar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalComoLlegarPageRoutingModule
  ],
  declarations: [ModalComoLlegarPage]
})
export class ModalComoLlegarPageModule {}
