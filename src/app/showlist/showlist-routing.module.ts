import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowlistPage } from './showlist.page';

const routes: Routes = [
  {
    path: '',
    component: ShowlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowlistPageRoutingModule {}
