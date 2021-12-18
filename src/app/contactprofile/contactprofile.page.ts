import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-contactprofile',
  templateUrl: './contactprofile.page.html',
  styleUrls: ['./contactprofile.page.scss'],
})
export class ContactprofilePage implements OnInit {

  profileid: any;
  data: any;
  id: any;
  message: string = "";
  image: any;

  constructor(
    private profileService: PropertyService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private callNumber: CallNumber
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('propertyID');
   }

  ngOnInit() {
    console.log(this.id);
    this.profileService.getcontactedlist(this.id).subscribe((res) => {
      console.log(res);
      if(res != undefined) {
        this.data = res.data;
        for(let i=0;i<this.data.length;i++) {
          this.image = this.data[i].profile_image.split("/");
          if(this.image[4] == "") {
            this.data[i].profile_image = "assets/img/user-profile-icon.png";
          }
        }
      } else {
        this.message = "No one contacted this property";
      }
    });
  }

  callNow(phoneNumber) {
    let callNumber = '91' + phoneNumber;
    console.log(callNumber);
    this.callNumber.callNumber(callNumber, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

}
