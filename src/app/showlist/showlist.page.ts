import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-showlist',
  templateUrl: './showlist.page.html',
  styleUrls: ['./showlist.page.scss'],
})
export class ShowlistPage implements OnInit {

  data: any;
  message: string;
  profileid: any;
  showlist: any;
  FeaturetypeSell: any = [{seq: "1", value: "Commercial Shop"}, {seq: "2", value: "Plot"}, {seq: "3", value: "Home & Plot"}, {seq:"4", value: "Flat"}];
  FeaturetypeRent: any = [{seq: "1", value: "Family & Bachelor"}, {seq: "2", value: "Family"}, {seq: "7", value: "Bachelor"}, {seq: "4", value: "Commercial"}];
  FeaturetypeRenttype: any = [{seq: "1", value: "All"},{seq: "2", value: "Boys Mess"},{seq: "3", value: "Girls Mess"},{seq: "4", value: "Girls Hostel"},{seq: "5", value: "Boys Hostel"}];
  

  constructor(
    private profileService: PropertyService,
    private route: ActivatedRoute, 
    private router: Router,
    public toastController: ToastController,
    private storage: Storage
    ) {
  }
  ngOnInit() {
    this.message = "";
    this.storage.get('profileid').then((val) => {
      this.profileid = val;
      console.log(this.profileid);
    })  
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.storage.get('showmap').then((val) => {
      console.log(val);
      if(val == "0") {
        console.log("Fired from showlist");
        this.router.navigate(['/landing/map']);
      } else {
        this.data = this.profileService.getdata();
        console.log(this.data);
        if(this.data.length > 0) {
          this.message = "";
          for(var i=0; i<this.data.length;i++) {

            if(this.data[i].propertyPurpose == "1") {
               if(this.data[i].propertyFor == "1") {
                 this.data[i].propertyFordesc = "Family & Bachelor"
               } else if(this.data[i].propertyFor == "2") {
                 this.data[i].propertyFordesc = "Family"
               } else if(this.data[i].propertyFor == "7") {
                 this.data[i].propertyFordesc = "Bachelor"
               } else if(this.data[i].propertyFor == "4") {
                 this.data[i].propertyFordesc = "Commercial"
               }
            }

            if(this.data[i].propertyPurpose == "2") {
              if(this.data[i].propertyFor == "1") {
                this.data[i].propertyFordesc = "Commercial Shop"
              } else if(this.data[i].propertyFor == "2") {
                this.data[i].propertyFordesc = "Plot"
              } else if(this.data[i].propertyFor == "7") {
                this.data[i].propertyFordesc = "Home & Plot"
              } else if(this.data[i].propertyFor == "4") {
                this.data[i].propertyFordesc = "Flat"
              }
           }
            
            

            if(this.data[i].isWishList == false) {
              this.data[i].isItemChecked = false;         
            } else {
              this.data[i].isItemChecked = true;         
            }
          }
        } else {
          this.message = "No property found";
        } 
      }
    })  
  }


  addDeleteWishlist(temp_propertyid,isWishList) {
    console.log(temp_propertyid);
    console.log(isWishList);
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
        })  
        this.removetoWishlist();
      }
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


