import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-mysubscription',
  templateUrl: './mysubscription.page.html',
  styleUrls: ['./mysubscription.page.scss'],
})
export class MysubscriptionPage implements OnInit {

  profileid: any;
  alldata: any;
  buttonDisabled = false;
  today: any;
  expirydate: any;
  message: string;
  count: any;

  constructor(
    private profileService: PropertyService,
    private router: Router,
    private storage: Storage
  ) { }

  ngOnInit() {
    console.log("ngOnInit");
    this.today = new Date().toISOString().slice(0, 10)
    console.log(this.today);
  }

  ionViewDidEnter() {
    this.message = "";
    this.storage.get('profileid').then((val) => {
      this.profileid = val;
      console.log(this.profileid);
      this.profileService.getmySubscriptionplan(this.profileid).subscribe((res) => {
        console.log(res);
        if( res != undefined) {
          this.alldata = res.data;
          this.profileService.getmycurrentSubscriptionplan(this.profileid).subscribe((resp) => {
            console.log(resp);
            if(resp == undefined) {
              this.buttonDisabled = false;
            } else {
              console.log(resp.data.remainingProperty);
              if(resp.data.remainingProperty == "0") {
                this.buttonDisabled = false;
              } else {
                this.buttonDisabled = true;
              }
            }
          })  
        } else {
          this.message = "You have no subscription";
        }
      });
    });  
  }

}
