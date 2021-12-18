import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MypropertyPageRoutingModule } from './myproperty-routing.module';

import { MypropertyPage } from './myproperty.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MypropertyPageRoutingModule
  ],
  declarations: [MypropertyPage]
})
export class MypropertyPageModule {}
