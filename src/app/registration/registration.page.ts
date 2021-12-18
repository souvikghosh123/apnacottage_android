import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FCM } from '@ionic-native/fcm/ngx';
import { Platform, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})

export class RegistrationPage implements OnInit {
  registrationForm: FormGroup;
  isSubmitted = false;
  UniqueDeviceID: string;
  message: any;
  deviceName: string;

  constructor(
    private profileService: PropertyService,
    private router: Router,
    public fb: FormBuilder,
    private fcm: FCM,
    private platform: Platform,
    public toastController: ToastController
  ) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]],
      referralCode: ['']
    }, {
      validator: this.ConfirmedValidator('password', 'confirm_password')
    })
  }

  ngOnInit() {
    console.log("ngOnInit");
    this.deviceName = "";
    if (this.platform.is('android')) {
      this.deviceName = 'android';
    } else if (this.platform.is('ios')) {
      this.deviceName = 'ios';
    } else if (this.platform.is('desktop')){
      this.deviceName = 'desktop';
    } else {
      this.deviceName = 'XXX';
    }
   }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.message = "";
    this.fcm.getToken().then(token => {
      console.log(token);
      this.UniqueDeviceID = token;
    });
  } 

  get errorControl() {
    return this.registrationForm.controls;
  } 

  onFormSubmit() {
    this.isSubmitted = true;
    if (!this.registrationForm.valid) {
      console.log('Please provide all the required values!');
      return false;
    } else {
      console.log(this.registrationForm.value);
      this.profileService.showLoader();
      console.log(this.deviceName);
      this.profileService.addProfiles(this.registrationForm.value, this.UniqueDeviceID, this.deviceName).subscribe((res) => {
        this.profileService.hideLoader();
        console.log(res);          
        if(res == undefined) {
          this.registrationForm.reset();
          this.message = "This mobile number is already registered. Try another mobile number.";
        } else {
          this.presentToast();
          this.router.navigate(['/login']);
        }  
      });
    }
  }

  ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your registration has been successfully completed.',
      duration: 2000
    });
    toast.present();
  }

}