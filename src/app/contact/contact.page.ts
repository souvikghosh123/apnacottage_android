import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  contactForm: FormGroup;
  isSubmitted = false;
  profileid: any;
  emailAddress: any;

  constructor(
    private profileService: PropertyService,
    private router: Router,
    public fb: FormBuilder,
    private storage: Storage,
    public toastController: ToastController
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    })
    
  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.storage.get('profileid').then((val) => {
      this.profileid = val;
      console.log(this.profileid);
    });
    this.profileService.getAdminContact().subscribe((res) => {
      console.log(res);
      this.emailAddress = res.data.emailID;
    })  
  }

  get errorControl() {
    return this.contactForm.controls;
  } 

  onFormSubmit() {
    this.isSubmitted = true;
    if (!this.contactForm.valid) {
      console.log('Please provide all the required values!');
      return false;
    } else {
      console.log(this.contactForm.value);
      this.profileService.contactMessage(this.contactForm.value, this.profileid).subscribe((res) => {
        console.log(res);          
        if(res == undefined) {
          this.contactForm.reset();
          this.sendFormFailure();
        } else {
          this.contactForm.reset();
          Object.keys(this.contactForm.controls).forEach(key => {
            this.contactForm.get(key).setErrors(null) ;
          });
          this.sendFormSuccess();
        }  
      });
    }
  }

  async sendFormSuccess() {
    const toast = await this.toastController.create({
      message: 'Message sent.Thanks for contacting us.',
      duration: 2000
    });
    toast.present();
  }

  async sendFormFailure() {
    const toast = await this.toastController.create({
      message: 'Message failed to send.',
      duration: 2000
    });
    toast.present();
  }


}
