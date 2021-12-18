import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {

  profileid: any;
  data: any
  message: string = "";

  constructor(
    private profileService: PropertyService,
    private route: ActivatedRoute, 
    private router: Router,
    private storage: Storage,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.storage.get('profileid').then((val) => {
      this.profileid = val;
      console.log(this.profileid);
      this.profileService.showWishlist(this.profileid).subscribe((res) => {
        console.log(res);
        if(res != undefined) {
          this.data = res.data;
          if(this.data != undefined) {
            for(var i=0; i<this.data.length;i++) {
              this.data[i].isItemChecked = true;         
            }
          }
        } else {
          console.log(this.data);
          this.message = "Wishlist is blank"
        }
      });
    });
  }

  verifyEvent(temp_propertyid) {
    console.log(temp_propertyid);
    this.profileService.removefromWishlist(this.profileid,temp_propertyid).subscribe((res) => {
      console.log(res);
      this.removefromWishlist();
      this.profileService.showWishlist(this.profileid).subscribe((res) => {
        console.log(res);
        if(res != undefined) {
          this.data = res.data;
          for(var i=0; i<this.data.length;i++) {
            this.data[i].isItemChecked = true;         
          }
        } else {
          this.data = undefined;
          this.message = "Wishlist is blank"
        }
      });
    });
  }

  async removefromWishlist() {
    const toast = await this.toastController.create({
      message: 'Remove from Wishlist.',
      duration: 2000
    });
    toast.present();
  }

}
