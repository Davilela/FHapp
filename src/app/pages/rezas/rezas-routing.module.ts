import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RezasPage } from './rezas.page';

const routes: Routes = [
  {
    path: '',
    component: RezasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RezasPageRoutingModule {}
