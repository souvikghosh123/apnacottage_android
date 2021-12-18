import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactpropertydetailsPageRoutingModule } from './contactpropertydetails-routing.module';

import { ContactpropertydetailsPage } from './contactpropertydetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactpropertydetailsPageRoutingModule
  ],
  declarations: [ContactpropertydetailsPage]
})
export class ContactpropertydetailsPageModule {}
