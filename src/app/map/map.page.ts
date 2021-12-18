import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { PropertyService } from './../shared/property.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

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
  locationData: any;

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
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter");
    this.autocomplete.input = "";
    this.data = this.profileService.getdata();
    this.locationData = this.profileService.getLocation();
    console.log(this.locationData);
    if(this.data != undefined) {
      this.markers = [];
      for(var i=0;i<this.data.length;i++) {
        if(this.data[i].propertyLocation) {
          this.temp_latitude = this.data[i].propertyLocation.split(",")[0];
          this.temp_longitude = this.data[i].propertyLocation.split(",")[1];
          this.markers.push({title:this.data[i].propertyName,
                            propertyID:this.data[i].propertyID,   
                            propertyAddress: this.data[i].propertyAddress, 
                            latitude:this.temp_latitude,
                            longitude:this.temp_longitude});
        }                    
      }
    }
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      if(this.locationData != undefined) {
        if(this.locationData.latitude != "" && this.locationData.longitude != "") {
          this.latitude = this.locationData.latitude;
          this.longitude = this.locationData.longitude;
          console.log("Searched Location");
        }  
      } 


      let latLng = new google.maps.LatLng(this.latitude, this.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.getAddressFromCoords(this.latitude, this.longitude);

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

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
