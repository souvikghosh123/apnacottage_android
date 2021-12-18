import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-contactproperty',
  templateUrl: './contactproperty.page.html',
  styleUrls: ['./contactproperty.page.scss'],
})
export class ContactpropertyPage implements OnInit {

  profileid: any;
  data: any;
  message: string;

  constructor(
    private profileService: PropertyService,
    private storage: Storage,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.storage.get('profileid').then((val) => {
      this.profileid = val;
      console.log(this.profileid);
      this.profileService.getContactedlist(this.profileid).subscribe((res) => {
        console.log(res);
        if(res != undefined) {
          this.data = res.data;
        } else {
          this.message = "Contacted list is blank"
        }
        
      });
    });
  }

  addDeleteWishlist(temp_propertyid,isWishList) {
    console.log(temp_propertyid);
    console.log(isWishList);
    this.storage.get('profileid').then((val) => {
      this.profileid = val;
      console.log(this.profileid);
      if(isWishList == false) {
        this.profileService.addtoWishlist(this.profileid,temp_propertyid).subscribe((res) => {
          console.log(res);
          if(res.status == true) {
            for(var i=0; i<this.data.length;i++) {
              if(this.data[i].propertyID == temp_propertyid) {
                this.data[i].isWishList = true;
              }
            }
          }
          this.addtoWishlist();
        });
      } else if (isWishList == true) {
        this.profileService.removefromWishlist(this.profileid,temp_propertyid).subscribe((res) => {
          console.log(res);
          if(res.status == true) {
            for(var i=0; i<this.data.length;i++) {
              if(this.data[i].propertyID == temp_propertyid) {
                this.data[i].isWishList = false;
              }
            }
          }
          this.removetoWishlist();
        })  
      }
    })
  }

  async addtoWishlist() {
    const toast = await this.toastController.create({
      message: 'Added in Wishlist.',
      duration: 2000
    });
    toast.present();
  }

  async removetoWishlist() {
    const toast = await this.toastController.create({
      message: 'Removed from Wishlist.',
      duration: 2000
    });
    toast.present();
  }

}
