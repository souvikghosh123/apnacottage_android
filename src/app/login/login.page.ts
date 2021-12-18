import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { AuthenticationService } from './../shared/authentication.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isSubmitted = false;
  UniqueDeviceID: string;
  message: string;
  deviceName: string;

  constructor(
    private profileService: PropertyService,
    private authenticationService: AuthenticationService,
    private router: Router,
    public fb: FormBuilder,
    public menu: MenuController,
    private storage: Storage,
    private fcm: FCM,
    private platform: Platform
  ) {
    this.loginForm = this.fb.group({
      mobile: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      password: ['']
    })
    
  }

  
  ngOnInit() {
    console.log("ngOnInit");
    this.menu.enable(false);
   }

   ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.message = "";
    this.deviceName = "";
    if (this.platform.is('ios')) {
      this.deviceName = 'ios';
    } else if (this.platform.is('android')) {
      this.deviceName = 'android';
    } else if (this.platform.is('desktop')){
      this.deviceName = 'desktop';
    } else {
      this.deviceName = 'XXX';
    }

    this.fcm.getToken().then(token => {
      console.log(token);
      this.UniqueDeviceID = token;
    });
  } 

   get errorControl() {
    return this.loginForm.controls;
  }   

  onFormSubmit() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      console.log('Please provide all the required values!');
      return false;
    } else {
      this.profileService.showLoader();
      console.log(this.deviceName);
      this.profileService.signInCustomer(this.loginForm.value, this.UniqueDeviceID, this.deviceName).subscribe((res) => {
        this.profileService.hideLoader();
        console.log(res);
        if(res == undefined) {
          this.loginForm.reset();
          this.message = "Wrong username or password.";
        } else {
          this.storage.set('profileid', res.data.profileID).then(() => {
            console.log(res.data.profileID);
            this.storage.set('sellORrent', "1").then(() => { 
              this.storage.set('name', res.data.name).then(() => {
                this.storage.set('profileImage', res.data.profileImage).then(() => {
                  localStorage.setItem('login', "1");
                  this.router.navigate(['landing']);
                  this.authenticationService.login();
                })
              })
            })
          })
        }
      })
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}