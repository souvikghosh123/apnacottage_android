import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactpropertyPageRoutingModule } from './contactproperty-routing.module';

import { ContactpropertyPage } from './contactproperty.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactpropertyPageRoutingModule
  ],
  declarations: [ContactpropertyPage]
})
export class ContactpropertyPageModule {}
