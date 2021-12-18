import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MypropertyviewPageRoutingModule } from './mypropertyview-routing.module';

import { MypropertyviewPage } from './mypropertyview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MypropertyviewPageRoutingModule
  ],
  declarations: [MypropertyviewPage]
})
export class MypropertyviewPageModule {}
