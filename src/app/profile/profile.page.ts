import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MenuController, IonSlides } from '@ionic/angular';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  name: String;
  mobile: String;
  email: String;
  address: String;
  profile_image: String;
  refer_code: String;
  pincode: String;
  public isValidated: String ;
  image: any;

  constructor(
    private profileService: PropertyService,
    private router: Router,
    private storage: Storage,
    public menu: MenuController
  ) {
    console.log("Profile contructor");
  }

  ngOnInit() {
    console.log("ngOnInit");
   }

   ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.storage.get('profileid').then((val) => {
      console.log("Get Storage: "+ val);
      this.getPickuprecord(val);
    }); 
   }

   ionViewDidEnter() {
    console.log("ionViewDidEnter");
    
  }

  getPickuprecord(id) {
    this.profileService.getProfiles(id).subscribe((res) => {   
      console.log(res);
        this.name = res.data.name;
        this.mobile = res.data.mobile;
        this.email = res.data.email;
        this.address = res.data.address;
        this.pincode = res.data.pincode;
        this.image = res.data.profile_image.split("/");
        if(this.image[4] != "") {
          this.profile_image = res.data.profile_image;
        } else {
          this.profile_image = "assets/img/user-profile-icon.png";
        }
        
    });
  }

  ngOnDestroy() {
    console.log("ngOnDestroy");
  }

  onFormSubmit() {
      this.router.navigate(['/landing/profileedit']);
  }

}
