import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavigationStart, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { Storage } from '@ionic/storage';
import { PropertyService } from './shared/property.service';
import { Location } from '@angular/common';
import { AuthenticationService } from './shared/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public name: string;
  public userDetail: any;
  public profileName: any;
  public profileImage: any;
  public image: any;

  public appPages = [
    {
      title: 'Home',
      url: '/landing',
      icon: 'home',
    },
    {
      title: 'Subscription',
      url: '/subscription',
      icon: 'calendar'
    },
    {
      title: 'My Subscription',
      url: '/mysubscription',
      icon: 'calendar'
    },
    {
      title: 'Wish List',
      url: '/wishlist',
      icon: 'heart'
    },
    {
      title: 'My Property',
      url: '/myproperty',
      icon: 'image'
    },
    {
      title: 'My Contacted Property',
      url: '/contactproperty',
      icon: 'images'
    },
    {
      title: 'Contact Us',
      url: '/contact',
      icon: 'call'
    },
    {
      title: 'About',
      url: '/about',
      icon: 'information-circle'
    },
    {
      title: 'Logout',
      url: '/logout',
      icon: 'log-out'
    }
  ];

  constructor(
    private profileService: PropertyService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private fcm: FCM,
    private storage: Storage,
    private _location: Location,
    private authenticationService: AuthenticationService
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.storage.get('name').then((val) => {
          this.profileName = val;
          this.storage.get('profileImage').then((val1) => {
            if(val1 != undefined) {
              this.image = val1.split("/");
              if(this.image[4] != "") {
                this.profileImage = val1;
              } else {
                this.profileImage = "assets/img/user-profile-icon.png";
              }
            }
          });  
        });
      }
    });
    this.initializeApp();
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackOpaque();
      this.splashScreen.hide();

      this.authenticationService.authState.subscribe(state => {
        if (state) {
          this.router.navigate(['landing']);
        } else {
          this.router.navigate(['login']);
        }
      });

      // subscribe to a topic
      // this.fcm.subscribeToTopic('Deals');

      // get FCM token
      this.fcm.getToken().then(token => {
        console.log(token);
      });

      // ionic push notification example
      this.fcm.onNotification().subscribe(data => {
        console.log(data);
        if (data.wasTapped) {
          console.log('Received in background');
        } else {
          console.log('Received in foreground');
        }
      });      

      // refresh the FCM token
      this.fcm.onTokenRefresh().subscribe(token => {
        console.log(token);
      });

      // unsubscribe from a topic
      // this.fcm.unsubscribeFromTopic('offers');
     

    });

    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this._location.isCurrentPathEqualTo('/landing/home')) {
        navigator['app'].exitApp();
      } else {
        // Navigate to back page
        this._location.back();
      }

    });

  }
}
