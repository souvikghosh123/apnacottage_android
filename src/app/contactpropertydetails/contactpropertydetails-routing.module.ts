import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactpropertydetailsPage } from './contactpropertydetails.page';

const routes: Routes = [
  {
    path: '',
    component: ContactpropertydetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactpropertydetailsPageRoutingModule {}
