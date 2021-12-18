import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactpropertyPage } from './contactproperty.page';

const routes: Routes = [
  {
    path: '',
    component: ContactpropertyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactpropertyPageRoutingModule {}
