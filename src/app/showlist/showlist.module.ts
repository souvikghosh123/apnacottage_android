import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowlistPageRoutingModule } from './showlist-routing.module';

import { ShowlistPage } from './showlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowlistPageRoutingModule
  ],
  declarations: [ShowlistPage]
})
export class ShowlistPageModule {}
