import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { PropertyService } from './../shared/property.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  @Input() model_title: string;
  map: any;
  address: string;
  infoWindows: any = [];
  profileid: any;
  markers: any = [];
  temp_latitude: any;
  temp_longitude: any;
  param: any;
  data: any;
  sellorRent = 1;
  allbutton = 5;
  sell = 0;
  rent = 1;
  latitude: number;
  longitude: number;
  public lat: number;
  public long: number;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  public mapOptions;

  constructor(
    private profileService: PropertyService,
    public menu: MenuController,
    private storage: Storage,
    private router: Router,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
   }

  ngOnInit() {
    this.menu.enable(true);
  }


  ionViewDidEnter() {
    this.markers = [];
    this.autocomplete.input = "";
    this.storage.get('profileid').then((val) => {
      this.profileid = val;
      console.log(this.profileid);
      this.param = {profileID:this.profileid, propertyPurpose: this.sellorRent};
      this.profileService.getProperty(this.param).subscribe((res) => {
        console.log(res);
        if(res != undefined) {
          for(var i=0;i<res.data.length;i++) {
            if(res.data[i].propertyLocation) {
              this.temp_latitude = res.data[i].propertyLocation.split(",")[0];
              this.temp_longitude = res.data[i].propertyLocation.split(",")[1];
              this.markers.push({title:res.data[i].propertyName,
                                propertyID:res.data[i].propertyID,  
                                propertyAddress: res.data[i].propertyAddress,
                                latitude:this.temp_latitude,
                                longitude:this.temp_longitude});
            } 
          }
          this.profileService.storedata(res.data);
        } else {
          this.profileService.storedata([]);
        }
        this.loadMap();
      })   
    });
  }

  homerent() {
    console.log("rent");
    this.sellorRent = 1;
    this.sell = 0;
    this.rent = 1;
    this.storage.set('sellORrent', "1").then(() => {
      this.ionViewDidEnter();
    })
    console.log(this.sellorRent);
  }

  sellproperty() {
    console.log("sell");
    this.sellorRent = 2;
    this.sell = 1;
    this.rent = 0;
    this.storage.set('sellORrent', "2").then(() => {
      this.ionViewDidEnter();
    })
    console.log(this.sellorRent);
  }

  colorCondition() {
    if(this.sellorRent == 1) {
      return true;
    } else if (this.sellorRent == 2) {
      return false;
    }
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      console.log(this.markers);
      this.addMarkersToMap(this.markers);

      this.map.addListener('dragend', () => {

        this.latitude = this.map.center.lat();
        this.longitude = this.map.center.lng();

        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords " + lattitude + " " + longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);

        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });

  }

  addMarkersToMap(markers) {
    for (let marker of markers) {
      let position = new google.maps.LatLng(marker.latitude, marker.longitude);
      let mapMarker = new google.maps.Marker({
        position: position,
        title: marker.title,
        propertyID: marker.propertyID,
        propertyAddress: marker.propertyAddress,
        latitude: marker.latitude,
        longitude: marker.longitude
      });

      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker);
    }
  }

  addInfoWindowToMarker(marker) {
    let infoWindowContent = '<div id="content">' +
                              '<h2 id="firstHeading" class"firstHeading">' + marker.title + '</h2>' +
                              '<p>Address: ' + marker.propertyAddress + '</p>' +
                              '<ion-button id="navigate">Details</ion-button>' +
                              '</div>';

    let infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });

    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);

      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        document.getElementById('navigate').addEventListener('click', () => {
          console.log('navigate button clicked!');
          // code to navigate using google maps app
          // window.open('https://www.google.com/maps/dir/?api=1&destination=' + marker.latitude + ',' + marker.longitude);
          this.router.navigate(['/property/', marker.propertyID]);
        });
      });
      
    });
    this.infoWindows.push(infoWindow);
  }

  closeAllInfoWindows() {
    for(let window of this.infoWindows) {
      window.close();
    }
  }

  //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
  UpdateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({input: this.autocomplete.input }, (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }
  
  //wE CALL THIS FROM EACH ITEM.
  SelectSearchResult(item) {
    this.autocomplete.input = item.description;
    const map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
    const geocoder = new google.maps.Geocoder();
    const infowindow = new google.maps.InfoWindow();
    let mapMarker = new google.maps.Marker({ map: map });
    this.lat = 0;
    this.long = 0;
    this.address = "";
    console.log(item); 
    this.placeid = item.place_id
    geocoder.geocode({ 'placeId': this.placeid }, (responses, status) => {
        if (status == 'OK') {
          if (responses[0]) {
            this.address = responses[0].formatted_address;
            this.lat = responses[0].geometry.location.lat();
            this.long = responses[0].geometry.location.lng();
            let latLng = new google.maps.LatLng(this.lat, this.long);
            this.mapOptions = {
              center: latLng,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            } 
            this.getAddressFromCoords(this.lat, this.long); 
            this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions); 
            console.log(this.markers);
            this.addMarkersToMap(this.markers);
            this.map.addListener('dragend', () => {
              this.lat = this.map.center.lat()
              this.long = this.map.center.lng()
              this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
            }); 
            // map.setZoom(13);
            // map.setCenter(responses[0].geometry.location);
            // mapMarker.setPlace({
            //   placeId: this.placeid,
            //   location: responses[0].geometry.location,
            // });
      
            // mapMarker.setVisible(true);
            // mapMarker = new google.maps.Marker({
            //   map,
            //   position: responses[0].geometry.location
            // });
            // mapMarker.setMap(this.map);
            // infowindow.setContent(responses[0].formatted_address);
            // infowindow.open(this.map, mapMarker);
          } else {
            window.alert("No results found");
          }
            
        }
    })    
    this.autocompleteItems = [];
  }
  
  //lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
  ClearAutocomplete(){
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }

}
