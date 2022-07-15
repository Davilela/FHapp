import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PenalPage } from './penal.page';

const routes: Routes = [
  {
    path: '',
    component: PenalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PenalPageRoutingModule {}
