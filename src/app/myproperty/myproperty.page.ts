import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-myproperty',
  templateUrl: './myproperty.page.html',
  styleUrls: ['./myproperty.page.scss'],
})
export class MypropertyPage implements OnInit {

  profileid: any;
  data: any;
  message: string;

  constructor(
    private profileService: PropertyService,
    private router: Router,
    private storage: Storage
  ) { }

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    this.storage.get('profileid').then((val) => {
      this.profileid = val;
      console.log(this.profileid);
      this.profileService.getmyPropertylist(this.profileid).subscribe((res) => {
        console.log(res);
        if(res != undefined) {
          this.message = "";
          this.data = res.data;
        } else {
          this.message = "My Property is blank"
        }
      });
    });
  }

  ionViewDidLeave() {

   } 

}
