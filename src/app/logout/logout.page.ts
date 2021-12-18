import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from './../shared/authentication.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    private router: Router,
    private storage: Storage,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.authenticationService.logout();
  }  

}
