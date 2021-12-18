import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MypropertyviewPage } from './mypropertyview.page';

const routes: Routes = [
  {
    path: '',
    component: MypropertyviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MypropertyviewPageRoutingModule {}
