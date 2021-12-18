import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { MenuController, IonSlides, NavController } from '@ionic/angular';

@Component({
  selector: 'app-profileedit',
  templateUrl: './profileedit.page.html',
  styleUrls: ['./profileedit.page.scss'],
})
export class ProfileeditPage implements OnInit {

  profileeditForm: FormGroup;
  isSubmitted = false;
  preview: string;
  id: any;
  profile_image: any;
  image: any;

  constructor(
    private profileService: PropertyService,
    private router: Router,
    public fb: FormBuilder,
    private storage: Storage
  ) {
    this.profileeditForm = this.fb.group({
      profileID: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirm_password: [''],
      address: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      profile_image: ['', [Validators.required]]
    }, {
      validator: this.ConfirmedValidator('password', 'confirm_password')
    })
  }

  ngOnInit() {
   }

   get errorControl() {
    return this.profileeditForm.controls;
  }  

   ionViewDidEnter() {
      this.storage.get('profileid').then((val) => {
        this.id = val;
        console.log("Get Storage: "+ val);
        this.profileService.getProfiles(val).subscribe(res => {
          this.profileeditForm.setValue({
            profileID: res.data['profileID'],
            name: res.data['name'],
            email: res.data['email'],
            password: "",
            confirm_password: "",
            address: res.data['address'],
            pincode: res.data['pincode'],
            profile_image: res.data['profile_image']
          });
        });
      });  
  }

  updateForm() {
    this.isSubmitted = true;
    if (!this.profileeditForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
        this.profileService.showLoader();
        this.profileeditForm.value.profile_image = this.preview;
        this.profileService.updateProfiles(this.profileeditForm.value).subscribe((res) => {
        this.profileService.hideLoader();
        console.log(res);
        this.profileService.getProfiles(this.id).subscribe((res) => {   
          console.log(res);
          this.storage.set('name', res.data.name).then(() => {
            this.storage.set('profileImage', res.data.profile_image).then(() => {
              this.router.navigate(['/landing/profile']);
            })
          })  
        })
      })
    }
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
    this.profileeditForm.patchValue({
      profile_image: file
    });
    this.profileeditForm.get('profile_image').updateValueAndValidity()
    
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  cancel() {
    this.router.navigate(['/landing/profile']);
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


}
