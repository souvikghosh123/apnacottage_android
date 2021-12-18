import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlusPageRoutingModule } from './plus-routing.module';

import { PlusPage } from './plus.page';

import { LocationPageModule } from '../location/location.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PlusPageRoutingModule,
    LocationPageModule
  ],
  declarations: [PlusPage]
})
export class PlusPageModule {}
