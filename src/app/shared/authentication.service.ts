import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class AuthenticationService {
  public loginStatus: any;

  authState = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private storage: Storage,
    private platform: Platform,
    public toastController: ToastController
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }

  ifLoggedIn() {
    this.loginStatus = localStorage.getItem('login');
      if (this.loginStatus == "1") {
        this.authState.next(true);
      }
  }


  login() {
    this.authState.next(true);
  }

  logout() {
    this.storage.clear();
    localStorage.clear();
    this.authState.next(false);
    this.router.navigate(['login']);
  }

  isAuthenticated() {
    return this.authState.value;
  }



}