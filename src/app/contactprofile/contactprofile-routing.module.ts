import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactprofilePage } from './contactprofile.page';

const routes: Routes = [
  {
    path: '',
    component: ContactprofilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactprofilePageRoutingModule {}
