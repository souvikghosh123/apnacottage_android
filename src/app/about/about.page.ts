import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  message: any;

  constructor(
    private profileService: PropertyService
  ) {
    
   }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.profileService.getAboutus().subscribe((res) => {
      console.log(res);
      for(var i=0; i<res.data.length;i++) {
        if(res.data[i].pageFor == "about-us") {
          this.message = res.data[i].pageContent;
        }
      }
    })  
  }

}
