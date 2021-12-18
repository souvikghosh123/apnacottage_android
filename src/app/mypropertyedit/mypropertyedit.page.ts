import { Component, OnInit, NgZone } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ToastController, ModalController } from '@ionic/angular';
import { LocationPage } from '../location/location.page';

@Component({
  selector: 'app-mypropertyedit',
  templateUrl: './mypropertyedit.page.html',
  styleUrls: ['./mypropertyedit.page.scss'],
})
export class MypropertyeditPage implements OnInit {

  ListingType: any = ["Any", "Resale", "New Contruction", "Foreclosure"];
  UnderContract: any = ["Yes", "No"];
  HomePrice: any = ["0", "100000", "500000", "100000", "1500000"];
  PropertyType: any = [];
  Bedrooms: any = ["Any", "1+", "2+", "3+", "4+", "5+", "6+"];
  Bathrooms: any = ["Any", "1+", "2+", "3+", "4+", "5+"];
  SquareFeet: any = ["400", "600", "800", "1000", "1200"];
  Features: any = [];
  FeaturetypeSell: any = [{seq: "1", value: "Commercial Shop"}, {seq: "2", value: "Plot"}, {seq: "3", value: "Home & Plot"}, {seq:"4", value: "Flat"}];
  FeaturetypeRent: any = [{seq: "1", value: "Family & Bachelor"}, {seq: "2", value: "Family"}, {seq: "7", value: "Bachelor"}, {seq: "4", value: "Commercial"}];
  FeaturetypeRenttype: any = [{seq: "1", value: "All"},{seq: "2", value: "Boys Mess"},{seq: "3", value: "Girls Mess"},{seq: "4", value: "Girls Hostel"},{seq: "5", value: "Boys Hostel"}];
  SelectedFeatures: any = [];
  tempFeatures: any = [];
  profileid: any;
  propertypurpose: any;
  mypropertyeditForm: FormGroup;
  isSubmitted = false;
  rentType = false;
  id: any;
  tempfeatureType: string;
  latitude: any;
  longitude: any;
  files: FileList;
  address:any;
  modelData: any;
  mapFlag: any;

  constructor(
    private profileService: PropertyService,
    private router: Router,
    private actRoute: ActivatedRoute,
    public fb: FormBuilder,
    private zone: NgZone,
    private storage: Storage,
    private geolocation: Geolocation,
    public toastController: ToastController,
    private modalController: ModalController
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('propertyID');
    this.mypropertyeditForm = this.fb.group({
      profileID: [''],
      propertyID: [''],
      propertyPurpose: [''],
      propertySalePrice: ['', [Validators.required]],
      propertyBedrooms: ['', [Validators.required]],
      propertyBathrooms: ['', [Validators.required]],
      propertyTypeID: ['', [Validators.required]],
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
      propertyImages: ['']
    })
   }

  ngOnInit() {
    this.storage.get('profileid').then((val) => {
      this.profileid = val;
      console.log(this.profileid);
    });

    this.profileService.getPropertydetails(this.id, this.profileid).subscribe((res) => {   
      console.log(res);
      this.propertypurpose = res.data.propertyPurpose;
      this.tempfeatureType = res.data['propertyFor'];
      this.tempFeatures = res.data['propertyFeatures'].split(",");
      this.mypropertyeditForm.setValue({
        profileID: res.data['profileID'],
        propertyID: res.data['propertyID'],
        propertyPurpose: res.data['propertyPurpose'],
        propertySalePrice: res.data['propertyOfferPrice'],
        propertyBedrooms: res.data['propertyBedrooms'],
        propertyBathrooms: res.data['propertyBathrooms'],
        propertyTypeID: res.data['propertyTypeID'],
        propertyArea: res.data['propertyArea'],
        propertyDescription: res.data['propertyDescription'],
        propertyAddress: res.data['propertyAddress'],
        propertyLocation: res.data['propertyLocation'],
        propertyFor: res.data['propertyFor'],
        propertyForDetails: res.data['propertyForDetails'],
        propertyHouseNumber: res.data['propertyHouseNumber'],
        propertyFloor: res.data['propertyFloor'],
        propertyRentPrice: res.data['propertyOfferPrice'],
        propertyContactNumber: res.data['propertyContactNumber'],
        propertyOwnership: res.data['propertyOwnership'],
        propertyName: res.data['propertyName'],
        propertySize: res.data['propertySize'],
        propertyImages: res.data['propertyImages']
      });
      if(this.propertypurpose == "2") {
        this.mypropertyeditForm.get("propertySalePrice").enable();
        this.mypropertyeditForm.get("propertyRentPrice").disable();
        this.mypropertyeditForm.get("propertyForDetails").disable();
      }  else {
        this.mypropertyeditForm.get("propertySalePrice").disable();
        this.mypropertyeditForm.get("propertyRentPrice").enable();
        this.mypropertyeditForm.get("propertyForDetails").enable();
      }
      if(this.propertypurpose == "1" && this.tempfeatureType == "7") {
        this.rentType = true;
      } else {
        this.rentType = false;
      }
      this.profileService.getPropertyTypeList().subscribe((res) => {
        console.log(res);
        this.PropertyType = res.data;
      })  
      this.profileService.getFeatureList().subscribe((res) => {
        console.log(res);
        this.Features = res.data;
  
        for(var i=0; i<this.Features.length;i++) {
          this.Features[i].isItemChecked = false; 
        }  
  
        for(var i=0; i<this.Features.length;i++) {
          for(var k=0; k<this.tempFeatures.length;k++) {
            if(this.Features[i].featureID == this.tempFeatures[k]) { 
              this.Features[i].isItemChecked = true;        
            }
          }
        }
      })  
    });


    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
    })  
  }

  get errorControl() {
    return this.mypropertyeditForm.controls;
  } 

 ionViewDidLeave() {
  this.mypropertyeditForm.reset();
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
    this.mypropertyeditForm.get("propertyForDetails").enable();
  } else {
    this.rentType = false;
    this.mypropertyeditForm.get("propertyForDetails").disable();
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
  this.mypropertyeditForm.value.propertyFeatures = this.SelectedFeatures;
  if(this.propertypurpose == "1") {
    this.mypropertyeditForm.value.propertySalePrice = "0";
  } else {
    this.mypropertyeditForm.value.propertyRentPrice = "0";
    this.mypropertyeditForm.value.propertyForDetails = "";
  }
  this.mypropertyeditForm.value.profileID = this.profileid;
  this.mypropertyeditForm.value.propertyID = this.id;
  this.mypropertyeditForm.value.propertyPurpose = this.propertypurpose;
  this.mypropertyeditForm.value.propertyLocation = this.latitude + "," + this.longitude;

  if (!this.mypropertyeditForm.valid) {
    console.log(this.mypropertyeditForm.value);
    console.log('Please provide all the required values!');
    this.displayError();
    return false;
  } else {
    this.profileService.showLoader();
    console.log(this.mypropertyeditForm.value);
      this.profileService.updatemyProperty(this.mypropertyeditForm.value, this.files).subscribe((res) => {
          this.zone.run(() => {
            this.profileService.hideLoader();
            console.log(res)
            this.mypropertyeditForm.reset();
            this.router.navigate(['/myproperty']);
          })
        });
    }
  }

cancel() {
  this.router.navigate(['/myproperty']);
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
      this.mypropertyeditForm.controls['propertyAddress'].setValue(modelData.data.address);
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
