import { Component, OnInit, NgZone } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { LocationPage } from '../location/location.page';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  FeaturetypeSell: any = [{seq: "1", value: "Commercial Shop"}, {seq: "2", value: "Plot"}, {seq: "3", value: "Home & Plot"}, {seq:"4", value: "Flat"}];
  FeaturetypeRent: any = [{seq: "1", value: "Family & Bachelor"}, {seq: "2", value: "Family"}, {seq: "7", value: "Bachelor"}, {seq: "4", value: "Commercial"},{seq: "5", value: "Roommate"}];
  FeaturetypeRenttype: any = [{seq: "1", value: "All"},{seq: "2", value: "Boys Mess"},{seq: "3", value: "Girls Mess"},{seq: "4", value: "Girls Hostel"},{seq: "5", value: "Boys Hostel"}];
  HomePrice: any = ["0","10000", "500000", "1000000", "1500000"]
  propertypurpose: any;
  bachelorFlag: boolean = false;
  searchForm: FormGroup;
  isSubmitted = false;
  data: any;
  profileid: any;
  latitude: any;
  longitude: any;
  address:any;
  modelData: any;
  mapFlag: any;

  constructor(
    private profileService: PropertyService,
    private router: Router,
    public fb: FormBuilder,
    private zone: NgZone,
    private storage: Storage,
    private modalController: ModalController
  ) {
    this.searchForm = this.fb.group({
      profileID: [''],
      propertyPurpose: [''],
      propertyFor: [''],
      propertyForDetails: [''],
      propertyMinPrice: [''],
      propertyMaxPrice: [''],
      propertyAddress: [''],
      propertyLocation: ['']
    })
   }

  ngOnInit() {
  }

  get errorControl() {
    return this.searchForm.controls;
  } 

  ionViewDidEnter() {
    this.latitude = null;
    this.longitude = null;
    this.address = null;
    this.searchForm.reset();
    this.storage.get('sellORrent').then((val) => {
      this.propertypurpose = val;
      if(this.propertypurpose == "2") {
        this.searchForm.get("propertyForDetails").disable();
      }  else {
        this.searchForm.get("propertyForDetails").enable();
      }
    })
    this.storage.get('profileid').then((val) => {
      this.profileid = val;
      console.log(this.profileid);
    });
 }


 Function(event) {
  console.log("This is radio button"); 
  console.log(event.target.value);
  // this.searchForm.value.propertyFor = event.target.value;
 } 

 Function1(event) {
  console.log("This is radio button"); 
  console.log(event.target.value);
  if(event.target.value == "7") {
    this.bachelorFlag = true;
    this.searchForm.get("propertyForDetails").enable();
  } else {
    this.bachelorFlag = false;
    this.searchForm.get("propertyForDetails").disable();
  }
  // this.searchForm.value.propertyForDetails = event.target.value;
 } 


onFormSubmit() {
  this.isSubmitted = true;
  this.searchForm.value.profileID = this.profileid;
  this.searchForm.value.propertyPurpose = this.propertypurpose;
  if(this.latitude == null || this.longitude == null) {
    this.searchForm.value.propertyLocation = null;
  } else {
    this.searchForm.value.propertyLocation = this.latitude + "," + this.longitude;
  }
  this.searchForm.value.propertyAddress = this.address;
  if (!this.searchForm.valid) {
    console.log('Please provide all the required values!');
    return false;
  } else {
    console.log(this.searchForm.value);
    this.profileService.searchproperty(this.searchForm.value).subscribe((res) => {
        this.zone.run(() => {
          console.log(res);
          if(res != undefined) {
            // let navigationExtras: NavigationExtras = {
            //   state: {
            //     property: res.data
            //   }
            // };
            this.profileService.storedata(res.data);
            this.searchForm.reset();
            // this.router.navigate(['/landing/showlist'], navigationExtras);
            this.router.navigate(['/landing/map']);
          } else {
            alert("No Data found");
          }
        })
      });
    }
  }

cancel() {
  this.searchForm.reset();
  this.router.navigate(['/landing']);
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
      this.profileService.setLocation(modelData.data);
      this.latitude = modelData.data.latitude;
      this.longitude = modelData.data.longitude;
      this.address = modelData.data.address;
      this.searchForm.controls['propertyAddress'].setValue(modelData.data.address);
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
