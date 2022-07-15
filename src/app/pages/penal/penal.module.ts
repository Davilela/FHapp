import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PenalPageRoutingModule } from './penal-routing.module';

import { PenalPage } from './penal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PenalPageRoutingModule
  ],
  declarations: [PenalPage]
})
export class PenalPageModule {}
