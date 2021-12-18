import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

declare var google;


@Component({
  selector: 'app-property',
  templateUrl: './property.page.html',
  styleUrls: ['./property.page.scss'],
})
export class PropertyPage implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  @Input() model_title: string;
  map: any;
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
  propertycallNumber: any;
  propertyEmail: any;
  propertyImages: any;
  contactflag: any = 0;
  profileid: any;
  message: string = "Property Added";
  phonenumber: string = "6291909780";
  email: string = "enquiry@email.com";
  data: any;
  isEnquery: boolean;
  contactDate: string;
  contactTime: string;
  messagePurpose: string;
  sameProfile = 0;
  whatsappContactNumber: any;
  whatsappLink: any;
  profile_image: any;
  Features: any = [];
  FeaturetypeSell: any = [{seq: "1", value: "Commercial Shop"}, {seq: "2", value: "Plot"}, {seq: "3", value: "Home & Plot"}, {seq:"4", value: "Flat"}];
  FeaturetypeRent: any = [{seq: "1", value: "Family & Bachelor"}, {seq: "2", value: "Family"}, {seq: "7", value: "Bachelor"}, {seq: "4", value: "Commercial"}];
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
  latitude: number;
  longitude: number;
  public lat: number;
  public lng: number;  
  source: any;
  destination: any
  public directionsService: any;
  public directionsDisplay: any;

  constructor(
    private profileService: PropertyService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    public menu: MenuController,
    public toastController: ToastController,
    private callNumber: CallNumber,
    private geolocation: Geolocation,
    public zone: NgZone,
    private launchNavigator: LaunchNavigator
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('propertyID');
   }

  ngOnInit() {

  } 

  ionViewWillEnter() {
    this.rentTypeflag = 0;
  }

  ionViewDidEnter() {
    this.profileService.getFeatureList().subscribe((res) => {
      console.log(res);
      this.Features = res.data;
      this.profileService.getPropertyTypeList().subscribe((res) => {
        console.log(res);
        this.PropertyType = res.data;
        this.storage.get('profileid').then((val) => {
          this.profileid = val;
          this.profileService.getPropertydetails(this.id,this.profileid).subscribe((res) => {   
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
              this.propertycallNumber = '+91' + res.data.propertyContactNumber;
              this.whatsappContactNumber = '+91' + res.data.propertyContactNumber;
              this.whatsappLink = "https://wa.me/" + this.whatsappContactNumber  +  "?text=Hello"
              this.propertyEmail = res.data.email;
              this.propertyImages = res.data.propertyImages;
              this.profile_image = res.data.profile_image;
              this.isEnquery = res.data.isEnquery;
              this.propertyPurpose = res.data.propertyPurpose;
              if(this.propertyLocation) {
                let propertyLoc = this.propertyLocation.split(",");
                this.latitude = parseFloat(propertyLoc[0]);
                this.longitude = parseFloat(propertyLoc[1]);
              } 
              if(res.data.enquery_date != undefined) {
                this.contactDate = res.data.enquery_date.split(" ")[0];
                this.contactTime = res.data.enquery_date.split(" ")[1];
              } else {
                this.contactDate = "";
                this.contactTime = "";
              }
    
              console.log(this.contactflag);
              console.log(this.isEnquery);
              if(this.isEnquery == true) {
                this.contactflag = 1;  
              } else {
                this.contactflag = 0;
              }
              if(res.data.propertyPurpose == "1") {
                this.messagePurpose = "Home for Rent";
              } else if(res.data.propertyPurpose == "2") {
                this.messagePurpose = "Home for Sale";
              }
              if(res.data.profileID == this.profileid) {
                this.sameProfile = 1;
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
                        if(res.data.propertyForDetails == "1") {
                          this.spropertyRentType = "All";
                        } else {
                          this.spropertyRentType = this.FeaturetypeRenttype[i].value;
                        }
                      }
                   }
                  } 
                  for(let i=0;i<this.FeaturetypeRent.length;i++) {
                    if(res.data.propertyFor == this.FeaturetypeRent[i].seq) {
                      if(res.data.propertyFor == "1") {
                       this.spropertyFeatureType = "Family & Bachelor";
                      } else {
                       this.spropertyFeatureType = this.FeaturetypeRent[i].value;
                      }
                    }
                  }
                } else if(res.data.propertyPurpose == "2") {
                    for (let i=0;i<this.FeaturetypeSell.length;i++) {
                      if(res.data.propertyFor == this.FeaturetypeSell[i].seq) {
                        if(res.data.propertyFor == "1") {
                          this.spropertyFeatureType = "Commercial Shop";
                        } else {
                          this.spropertyFeatureType = this.FeaturetypeSell[i].value;
                        }  
                      }
                    }
                }
              }
              this.loadMapDirection();
          })
        })
      })  
    })  
  }


  contact() {
    this.contactflag = 1;
    console.log(this.contactflag);
    console.log(this.isEnquery);
      this.profileService.addtoContactedlist(this.profileid, this.id, this.message, this.propertyContactNumber, this.email ).subscribe((res) => {
        console.log(res);
        if(res.data.addedOn != undefined) {
          this.contactDate = res.data.addedOn.split(" ")[0];
          this.contactTime = res.data.addedOn.split(" ")[1];
        } else {
          this.contactDate = "";
          this.contactTime = "";
        }
        if(res.status == true) {
          this.addtoContactlist();
        }
      });
  }

  async addtoContactlist() {
    const toast = await this.toastController.create({
      message: 'Added in Contacted List.',
      duration: 2000
    });
    toast.present();
  }

  callNow() {
    this.callNumber.callNumber(this.propertycallNumber, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  showInfo() {
    console.log("Show info");
    this.showinfoflag = 1;
  }

  hideInfo() {
    console.log("Hide info");
    this.showinfoflag = 0;
  }

  loadMapDirection(){
    this.geolocation.getCurrentPosition().then((resp) => {

        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;

        console.log(this.lat, this.lng);
        console.log(this.latitude, this.longitude);

    })
  }
  

  navigateLocation(){
    let destination = [this.latitude, this.longitude];

    let options: LaunchNavigatorOptions = {
        start:[this.lat,this.lng],
        app: this.launchNavigator.APP.GOOGLE_MAPS
    };
    this.launchNavigator.navigate(destination, options)  //here
    .then(success =>{
        console.log(success);
    },error=>{
        console.log(error);
    })
}


}
