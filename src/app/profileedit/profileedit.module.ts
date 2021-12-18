import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileeditPageRoutingModule } from './profileedit-routing.module';

import { ProfileeditPage } from './profileedit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfileeditPageRoutingModule
  ],
  declarations: [ProfileeditPage]
})
export class ProfileeditPageModule {}
