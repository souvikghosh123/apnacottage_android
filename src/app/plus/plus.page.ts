import { Component, OnInit, NgZone, Input } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ToastController } from '@ionic/angular';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { LocationPage } from '../location/location.page';

@Component({
  selector: 'app-plus',
  templateUrl: './plus.page.html',
  styleUrls: ['./plus.page.scss'],
})
export class PlusPage implements OnInit {

  modelData: any;
  @Input() model_title: string;
  ListingType: any = ["Any", "Resale", "New Contruction", "Foreclosure"];
  UnderContract: any = ["Yes", "No"];
  HomePrice: any = ["0", "100000", "500000", "100000", "1500000"];
  PropertyType: any = [];
  Bedrooms: any = ["Any", "1+", "2+", "3+", "4+", "5+", "6+"];
  Bathrooms: any = ["Any", "1+", "2+", "3+", "4+", "5+"];
  SquareFeet: any = ["400", "600", "800", "1000", "1200"];
  Features: any = [];
  FeaturetypeSell: any = [{seq: "1", value: "Commercial Shop"}, {seq: "2", value: "Plot"}, {seq: "3", value: "Home & Plot"}, {seq:"4", value: "Flat"}];
  FeaturetypeRent: any = [{seq: "1", value: "Family & Bachelor"}, {seq: "2", value: "Family"}, {seq: "7", value: "Bachelor"}, {seq: "4", value: "Commercial"},{seq: "5", value: "Roommate"}];
  FeaturetypeRenttype: any = [{seq: "1", value: "All"},{seq: "2", value: "Boys Mess"},{seq: "3", value: "Girls Mess"},{seq: "4", value: "Girls Hostel"},{seq: "5", value: "Boys Hostel"}];
  SelectedFeatures: any = [];
  profileid: any;
  propertypurpose: any;
  propertyaddForm: FormGroup;
  isSubmitted = false;
  rentType = false;
  latitude: any;
  longitude: any;
  files: FileList;
  mapFlag: any;
  public address:any;
  msg: any;


  constructor(
    private profileService: PropertyService,
    private router: Router,
    public fb: FormBuilder,
    private zone: NgZone,
    private storage: Storage,
    private geolocation: Geolocation,
    public toastController: ToastController,
    private modalController: ModalController
  ) {
    this.propertyaddForm = this.fb.group({
      profileID: [''],
      propertyPurpose: [''],
      propertySalePrice: ['', [Validators.required]],
      propertyBedrooms: ['', [Validators.required]],
      propertyBathrooms: ['', [Validators.required]],
      propertyTypeID: ['', [Validators.required]],
      propertyFeatures: [''],
      propertyArea: ['', [Validators.required]],
      propertyDescription: ['', [Validators.required]],
      propertyAddress: ['', [Validators.required]],
      propertyLocation: [''],
      propertyFor: ['', [Validators.required]],
      propertyForDetails: ['', [Validators.required]],
      propertyHouseNumber: ['', [Validators.required]],
      propertyFloor: ['', [Validators.required]],
      propertyRentPrice: ['', [Validators.required]],
      propertyContactNumber: ['', [Validators.required]],
      propertyOwnership: ['', [Validators.required]],
      propertyName: ['', [Validators.required]],
      propertySize: ['', [Validators.required]],
      propertyImages: ['', [Validators.required]]
    })
   }

  ngOnInit() {  
 
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.storage.get('profileid').then((val) => {
      this.profileid = val;
      console.log(this.profileid);
      this.rentType = false;
      this.storage.get('sellORrent').then((val) => {
        this.propertypurpose = val;
        if(this.propertypurpose == "2") {
          this.propertyaddForm.get("propertySalePrice").enable();
          this.propertyaddForm.get("propertyRentPrice").disable();
          this.propertyaddForm.get("propertyForDetails").disable();
        }  else if(this.propertypurpose == "1") {
          this.propertyaddForm.get("propertySalePrice").disable();
          this.propertyaddForm.get("propertyRentPrice").enable();
          this.propertyaddForm.get("propertyForDetails").enable();
        }
      })

      this.profileService.getPropertyTypeList().subscribe((res) => {
        console.log(res);
        this.PropertyType = res.data;
      })  
      this.profileService.getFeatureList().subscribe((res) => {
        console.log(res);
        this.Features = res.data;
        for(var i=0; i<res.data.length;i++) {
          this.Features[i].isItemChecked = false;         
        }
      })  
      this.geolocation.getCurrentPosition().then((resp) => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
      })  
    });
  }

  get errorControl() {
    return this.propertyaddForm.controls;
  } 

  ionViewDidLeave() {
    this.propertyaddForm.reset();
    Object.keys(this.propertyaddForm.controls).forEach(key => {
      this.propertyaddForm.get(key).setErrors(null) ;
    });
}


 Function(event) {
  console.log("This is radio button"); 
  console.log(event.target.value);
 } 

 Function1(event) {
  console.log("This is radio button"); 
  console.log(event.target.value);
  if(event.target.value == "7") {
    this.rentType = true;
    this.propertyaddForm.get("propertyForDetails").enable();
  } else {
    this.rentType = false;
    this.propertyaddForm.get("propertyForDetails").disable();
  }
 } 


 verifyEvent() {
  console.log(this.Features);
}


uploadFile(event) { 
  this.files=event.target.files;
  console.log(this.files);
}

onFormSubmit() {
  this.isSubmitted = true;

  for(var i=0; i<this.Features.length;i++) {
    if(this.Features[i].isItemChecked == true) {
      this.SelectedFeatures.push(this.Features[i].featureID);
    }          
  }
  this.propertyaddForm.value.propertyFeatures = this.SelectedFeatures;
  if(this.propertypurpose == "1") {
    this.propertyaddForm.value.propertySalePrice = "0";
  } else {
    this.propertyaddForm.value.propertyRentPrice = "0";
    this.propertyaddForm.value.propertyForDetails = "";
  }
  this.propertyaddForm.value.profileID = this.profileid;
  this.propertyaddForm.value.propertyPurpose = this.propertypurpose;
  this.propertyaddForm.value.propertyLocation = this.latitude + "," + this.longitude;
  this.propertyaddForm.value.propertyAddress = this.address;
  if (!this.propertyaddForm.valid) {
    console.log(this.propertyaddForm.value);
    console.log('Please provide all the required values!');
    this.displayError();
    return false;
  } else {
      console.log(this.propertyaddForm.value);
      this.profileService.showLoader();
      this.profileService.getmycurrentSubscriptionplan(this.profileid).subscribe((resp) => {
        console.log(resp);
        if(resp != undefined) {
          this.profileService.addProperty(this.propertyaddForm.value, this.files).subscribe((res) => {
            this.zone.run(() => {
              this.profileService.hideLoader();
              console.log(res);
              this.propertyaddForm.reset();
              this.router.navigate(['/myproperty']);
            })
          });
        } else {
          this.profileService.hideLoader();
          alert("You have no active subscription plan OR your property limit is over");
          this.router.navigate(['/subscription']);
        }
      })  
    }
  }

cancel() {
  this.propertyaddForm.reset();
  this.router.navigate(['/landing']);
}

keyPress(event: any) {
  const pattern = /[0-9\+\-\ ]/;
  let inputChar = String.fromCharCode(event.charCode);
  if (event.keyCode != 8 && !pattern.test(inputChar)) {
    event.preventDefault();
  }
}

async displayError() {
  const toast = await this.toastController.create({
    message: 'Please fill up all the required fields',
    duration: 2000
  });
  toast.present();
}

async location() {
  const modal = await this.modalController.create({
    component: LocationPage,
    componentProps: {
      'model_title': "MAP"
    }
  }); 

  modal.onDidDismiss().then((modelData) => {
      console.log(modelData.data);
      this.latitude = modelData.data.latitude;
      this.longitude = modelData.data.longitude;
      this.address = modelData.data.address;
      this.propertyaddForm.controls['propertyAddress'].setValue(modelData.data.address);
      this.modelData = modelData.data;
      console.log('Modal Data : ' + modelData.data);
      if(this.modelData.address) {
        console.log(this.modelData.address);
        this.mapFlag = false;
      } else {
        console.log(this.modelData.address);
        this.mapFlag = true;
      }
  });

  return await modal.present();
}


}
