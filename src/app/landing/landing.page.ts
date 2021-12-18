import { Component, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PropertyService } from './../shared/property.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {

  message: any = "Show List";
  count: number = 0;
  result; number;
  profileid: any;

  constructor(
    private profileService: PropertyService,
    private storage: Storage,
    private router: Router,
    public navCtrl: NavController,
    private zone: NgZone
  ) { }

  ngOnInit() {
    
  }

  showlist(){
    console.log("Click the showlist tab");
    this.count++;
    this.result = this.count % 2;
    console.log(this.count);
    if(this.result == 1) {
      console.log(this.result);
      this.message = "Show Map";
      this.storage.set('showmap', "1"); 
    } else {
      console.log(this.result);
      this.message = "Show List";
      this.storage.set('showmap', "0");
      console.log("Fired from landing");
      this.router.navigate(['/landing/map']);
    }
  }

  home() {
    console.log("Clicking Home Tab");
    this.message = "Show List";
    this.storage.set('showmap', "0");
    this.count = 0;
  }

  plus() {
    this.message = "Show List";
    this.storage.set('showmap', "0");
    this.count = 0; 
  }

  search() {
    this.message = "Show List";
    this.storage.set('showmap', "0");
    this.count = 0;
  }

  profile() {
    this.message = "Show List";
    this.storage.set('showmap', "0");
    this.count = 0;
  }

}
