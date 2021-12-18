import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MypropertyeditPageRoutingModule } from './mypropertyedit-routing.module';

import { MypropertyeditPage } from './mypropertyedit.page';

import { LocationPageModule } from '../location/location.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MypropertyeditPageRoutingModule,
    LocationPageModule
  ],
  declarations: [MypropertyeditPage]
})
export class MypropertyeditPageModule {}
