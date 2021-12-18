import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactprofilePageRoutingModule } from './contactprofile-routing.module';

import { ContactprofilePage } from './contactprofile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactprofilePageRoutingModule
  ],
  declarations: [ContactprofilePage]
})
export class ContactprofilePageModule {}
