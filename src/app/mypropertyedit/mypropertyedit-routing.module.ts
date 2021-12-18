import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MypropertyeditPage } from './mypropertyedit.page';

const routes: Routes = [
  {
    path: '',
    component: MypropertyeditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MypropertyeditPageRoutingModule {}
