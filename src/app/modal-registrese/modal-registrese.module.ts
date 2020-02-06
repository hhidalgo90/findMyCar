import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalRegistresePageRoutingModule } from './modal-registrese-routing.module';

import { ModalRegistresePage } from './modal-registrese.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalRegistresePageRoutingModule
  ],
  declarations: [ModalRegistresePage]
})
export class ModalRegistresePageModule {}
