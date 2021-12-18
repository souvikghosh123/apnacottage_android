import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.page.html',
  styleUrls: ['./forgetpassword.page.scss'],
})

export class ForgetpasswordPage implements OnInit {
  forgetpasswordForm: FormGroup;
  isSubmitted = false;

  constructor(
    private profileService: PropertyService,
    private router: Router,
    public fb: FormBuilder,
    public menu: MenuController,
    public toastController: ToastController
  ) {
    this.forgetpasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  ngOnInit() {
    this.menu.enable(false);
   }

  get errorControl() {
    return this.forgetpasswordForm.controls;
  }  

  onFormSubmit() {
    this.isSubmitted = true;
    if (!this.forgetpasswordForm.valid) {
      console.log('Please provide all the required values!');
      return false;
    } else {
      this.profileService.showLoader();
      this.profileService.sendOtpForgetPassword(this.forgetpasswordForm.value).subscribe((res) => {
        this.profileService.hideLoader();
        console.log(res);
        if(res == undefined) {
          this.sendNopassword();
          this.forgetpasswordForm.reset();
        } else if(res.status == true) {
          this.sendPassword();
          this.router.navigate(['/login']);
        }
      });
    }
  }

  back() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  async sendPassword() {
    const toast = await this.toastController.create({
      message: 'Email sent with new password.',
      duration: 2000
    });
    toast.present();
  }

  async sendNopassword() {
    const toast = await this.toastController.create({
      message: 'No user found.',
      duration: 2000
    });
    toast.present();
  }
  
}