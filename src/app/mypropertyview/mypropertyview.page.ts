import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mypropertyview',
  templateUrl: './mypropertyview.page.html',
  styleUrls: ['./mypropertyview.page.scss'],
})
export class MypropertyviewPage implements OnInit {

  id: any;
  propertyName: any;
  propertyDescription: any;
  propertyLocation: any;
  propertyAddress: any;
  propertyBathrooms: any;
  propertyBedrooms: any;
  propertyOfferPrice: any;
  propertyOwnership: any;
  propertyFloor: any;
  propertyArea: any;
  propertySize: any;
  propertyHouseNumber: any;
  propertyContactNumber: any;
  propertyImages: [];
  contactflag: any = 0;
  profileid: any;
  message: any;
  Features: any = [];
  FeaturetypeSell: any = [{seq: "1", value: "All"}, {seq: "2", value: "Plot"}, {seq: "3", value: "Home & Plot"}, {seq:"4", value: "Flat"}];
  FeaturetypeRent: any = [{seq: "1", value: "All"}, {seq: "2", value: "Family"}, {seq: "7", value: "Bachlor"}, {seq: "4", value: "Commercial"}];
  FeaturetypeRenttype: any = [{seq: "1", value: "All"},{seq: "2", value: "Boys Mess"},{seq: "3", value: "Girls Mess"},{seq: "4", value: "Girls Hostel"},{seq: "5", value: "Boys Hostel"}];
  PropertyType: any = [];
  propertyFeature: any;
  tpropertyFeature: any;
  spropertyFeature = "";
  showinfoflag = 0;
  count = 0;
  featureType: any;
  spropertyType: any;
  spropertyFeatureType: any;
  spropertyRentType: any;
  rentTypeflag = 0;
  propertyPurpose: any;
  propertyStatus: any; 
  activeFlag: any;
  subscriptionFlag = false;

  constructor(
    private profileService: PropertyService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    public menu: MenuController,
    public toastController: ToastController
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('propertyID');
   }

  ngOnInit() {
    this.storage.get('profileid').then((val) => {
      this.profileid = val;
      console.log(this.profileid);
    })  
  } 

  ionViewWillEnter() {
    this.rentTypeflag = 0;
  }
   
  ionViewDidEnter() {
    this.profileService.showLoader();
    this.profileService.getFeatureList().subscribe((res) => {
      console.log(res);
      this.Features = res.data;
      this.profileService.getPropertyTypeList().subscribe((res) => {
        console.log(res);
        this.PropertyType = res.data;
        this.profileService.getPropertydetails(this.id, this.profileid).subscribe((res) => {   
          this.profileService.hideLoader();
          console.log(res);
            this.propertyName = res.data.propertyName;
            this.propertyDescription = res.data.propertyDescription;
            this.propertyLocation = res.data.propertyLocation;
            this.propertyAddress = res.data.propertyAddress;
            this.propertyBathrooms = res.data.propertyBathrooms;
            this.propertyBedrooms = res.data.propertyBedrooms;
            this.propertyOfferPrice = res.data.propertyOfferPrice;
            this.propertyOwnership = res.data.propertyOwnership;
            this.propertyFloor = res.data.propertyFloor;
            this.propertyArea = res.data.propertyArea;
            this.propertySize = res.data.propertySize;
            this.propertyHouseNumber = res.data.propertyHouseNumber;
            this.propertyContactNumber = res.data.propertyContactNumber;
            this.propertyImages = res.data.propertyImages;
            this.propertyPurpose = res.data.propertyPurpose;
            this.propertyStatus = res.data.propertyStatus;
            if(res.subscription) {
              this.subscriptionFlag = true;
            } else {
              this.subscriptionFlag = false;
            }
            if(res.data.propertyPurpose == "1") {
              this.message = "Property for Rent"
            } else if(res.data.propertyPurpose == "2") {
              this.message = "Property for Sell"
            }
            if(res.data.propertyFeatures != undefined) {
              this.tpropertyFeature = res.data.propertyFeatures.split(",");
              for(let i=0;i<this.tpropertyFeature.length;i++) {
                for(let x=0;x<this.Features.length;x++) {
                  if(this.tpropertyFeature[i] == this.Features[x].featureID) {
                    if(this.count > 0) {
                      this.spropertyFeature = this.spropertyFeature + ",";
                    }
                    this.spropertyFeature = this.spropertyFeature + this.Features[x].featureName;
                    this.count = this.count + 1;
                  }
                }
              }
            }
            if(res.data.propertyTypeID != undefined) {
              for(let i=0; i<this.PropertyType.length;i++) {
                if(res.data.propertyTypeID == this.PropertyType[i].propertyTypeID) {
                  this.spropertyType = this.PropertyType[i].propertyTypeName;
                }
              }
            }
            if(res.data.propertyFor != undefined) {
              if(res.data.propertyPurpose == "1") {
                if(res.data.propertyFor == "7") {
                  this.rentTypeflag = 1;
                  for(let i=0;i<this.FeaturetypeRenttype.length;i++) {
                    if(res.data.propertyForDetails == this.FeaturetypeRenttype[i].seq) {
                        this.spropertyRentType = this.FeaturetypeRenttype[i].value;
                    }
                 }
                } else {
                    for(let i=0;i<this.FeaturetypeRent.length;i++) {
                      if(res.data.propertyFor == this.FeaturetypeRent[i].seq) {
                          this.spropertyFeatureType = this.FeaturetypeRent[i].value;
                      }
                    }
                  }
              } else if(res.data.propertyPurpose == "2") {
                  for (let i=0;i<this.FeaturetypeSell.length;i++) {
                    if(res.data.propertyFor == this.FeaturetypeSell[i].seq) {
                        this.spropertyFeatureType = this.FeaturetypeSell[i].value;
                    }
                  }
              }
            }
        })
      })  
    })  
  }

  edit() {
    this.router.navigate(['/mypropertyedit', this.id]);
  }

  delete() {
    this.profileService.showLoader();
    this.profileService.propertyDelete(this.id).subscribe((res) => {   
      console.log(res);
      this.profileService.hideLoader();
      this.propertyDeleted();
      this.router.navigate(['/myproperty']);
    })  
  }

  showInfo() {
    console.log("Show info");
    this.showinfoflag = 1;
  }

  hideInfo() {
    console.log("Hide info");
    this.showinfoflag = 0;
  }

  active() {
    if(this.subscriptionFlag == true) {
      if(this.propertyStatus == "1") {
        this.activeFlag = "0";
      } else if(this.propertyStatus == "0") {
        this.activeFlag = "1";
      }
      this.profileService.showLoader();
      this.profileService.propertyActiveDeactive(this.id, this.profileid, this.activeFlag).subscribe((res) => {   
        console.log(res);
        this.profileService.hideLoader();
        if(res.status == true) {
          this.propertyStatus = this.activeFlag;
          if(this.propertyStatus == "1") {
            this.propertyActivated();
          } else if(this.propertyStatus == "0"){
            this.propertyDeactivated();
          }
        }
      })  
    } else {
      this.subscriptionExpiry();
    }
  }

  async propertyActivated() {
    const toast = await this.toastController.create({
      message: 'Property Activated',
      duration: 2000
    });
    toast.present();
  }

  async propertyDeactivated() {
    const toast = await this.toastController.create({
      message: 'Property Deactivated',
      duration: 2000
    });
    toast.present();
  }

  async propertyDeleted() {
    const toast = await this.toastController.create({
      message: 'Property Deleted',
      duration: 2000
    });
    toast.present();
  }

  async subscriptionExpiry() {
    const toast = await this.toastController.create({
      message: 'Subscription Expired. Please buy new subscription.',
      duration: 3000
    });
    toast.present();
  }

}
