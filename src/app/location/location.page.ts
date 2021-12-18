import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage {
  @ViewChild('map',  {static: false}) mapElement: ElementRef;
  @Input() model_title: string;
  public map: any;
  public address:any;
  public lat: number;
  public long: number;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  // public latitude: any;
  // public longitude: any;
  public mapOptions;
  modalTitle: string;

  constructor(
    private nativeGeocoder: NativeGeocoder,    
    public zone: NgZone,
    private modalController: ModalController,
    private geolocation: Geolocation
  ) { 
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  //LOAD THE MAP ONINIT.
  ionViewDidEnter() {
    this.loadMap();    
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {

      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('dragend', () => {

        this.lat = this.map.center.lat();
        this.long = this.map.center.lng();

        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  
  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords "+lattitude+" "+longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5    
    }; 
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if(value.length>0)
          responseAddress.push(value); 
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value+", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) =>{ 
        this.address = "Address Not Available!";
      }); 
  }

  //FUNCTION SHOWING THE COORDINATES OF THE POINT AT THE CENTER OF THE MAP
  ShowCords(){
    alert('lat' +this.lat+', long'+this.long )
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

  async closeModel() {
    const close = {"latitude": this.lat, "longitude": this.long, "address": this.address};
    console.log(close);
    await this.modalController.dismiss(close);
  }

  async goBack() {
    const close = {"latitude": "", "longitude": "", "address": ""};
    console.log(close);
    await this.modalController.dismiss(close);
  }


}
