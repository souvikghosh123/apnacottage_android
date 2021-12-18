import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MypropertyPage } from './myproperty.page';

const routes: Routes = [
  {
    path: '',
    component: MypropertyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MypropertyPageRoutingModule {}
