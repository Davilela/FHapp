import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RezasPageRoutingModule } from './rezas-routing.module';

import { RezasPage } from './rezas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RezasPageRoutingModule
  ],
  declarations: [RezasPage]
})
export class RezasPageModule {}
