import { Injectable } from '@angular/core';
import { Profiles } from './profiles';
import { Property } from './property';
import { Policy } from  './policy';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class PropertyService {

  BASE_URL = "https://admin.apnacottage.com/api/user";
  BASE_URL1 = "https://admin.apnacottage.com/api";

  public sharedData: any;
  public sharedLocation: any;
  public userDetail = {userName:"", userImage: ""};
  public propertyImages: [];

  constructor(
    private http: HttpClient,
    public loadingController: LoadingController,
    private storage: Storage
    ) { }


  storedata(var1) {
    this.sharedData = var1;
  }

  getdata() {
    return this.sharedData;
  }

  setLocation(data) {
    this.sharedLocation = data;
  }

  getLocation() {
    return this.sharedLocation;
  }

  storeusedetail(var1, var2) {
    this.userDetail.userName = var1;
    this.userDetail.userImage = var2;
  }

  getusedetail() {
    return this.userDetail;
  }

  signInCustomer(profiles: Profiles, uniqueDeviceID, deviceName): Observable<any> {

    const formData = new FormData();
    formData.append('mobile', profiles.mobile);
    formData.append('password', profiles.password);
    formData.append('deviceID', uniqueDeviceID);
    formData.append('deviceName', deviceName);

    return this.http.post<Profiles>(`${this.BASE_URL}/login`, formData)
      .pipe(
        catchError(this.handleError<Profiles>('Add Profiles'))
      );
  }

  addProfiles(profiles: Profiles, uniqueDeviceID, deviceName): Observable<any> {

    const formData = new FormData();
    formData.append('name', profiles.name);
    formData.append('email', profiles.email);
    formData.append('mobile', profiles.mobile);
    formData.append('password', profiles.password);
    formData.append('deviceID', uniqueDeviceID);
    formData.append('deviceName', deviceName);
    
    return this.http.post<any>(`${this.BASE_URL}/register`, formData)
      .pipe(
        catchError(this.handleError<any>('Add Profiles'))
      );
  }

  sendOtpForgetPassword(profiles: Profiles) {
    const formData = new FormData();
    formData.append('email', profiles.email);
    return this.http.post<any>(`${this.BASE_URL}/forget-password`, formData)
      .pipe(
        tap(_ => console.log(`Send password for forget password:`)),
        catchError(this.handleError<any>(`Error`))
      );
  }

  getProfiles(id): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/details/` + id)
      .pipe(
        tap(_ => console.log(`Profiles fetched: ${id}`)),
        catchError(this.handleError<any>(`Get Profiles id=${id}`))
      );
  }

  addProperty(property: Property, files) {
    console.log(property);
    const formData = new FormData();
    formData.append('profileID', property.profileID);
    formData.append('propertyPurpose', property.propertyPurpose);
    formData.append('propertyTypeID', property.propertyTypeID);
    formData.append('propertyName', property.propertyName);
    formData.append('propertyDescription', property.propertyDescription);
    formData.append('propertyAddress', property.propertyAddress);
    formData.append('propertyLocation', property.propertyLocation);
    formData.append('propertyBathrooms', property.propertyBathrooms);
    formData.append('propertyBedrooms', property.propertyBedrooms);
    if(property.propertyPurpose == "1") {
      formData.append('propertyOfferPrice', property.propertyRentPrice);
    } else {
      formData.append('propertyOfferPrice', property.propertySalePrice);
    }
    formData.append('propertyOwnership', property.propertyOwnership);
    formData.append('propertyFloor', property.propertyFloor);
    formData.append('propertyArea', property.propertyArea);
    formData.append('propertySize', property.propertySize);
    formData.append('propertyFeatures', property.propertyFeatures);
    formData.append('propertyFor', property.propertyFor);
    formData.append('propertyForDetails', property.propertyForDetails);
    formData.append('propertyContactNumber', property.propertyContactNumber);
    formData.append('propertyHouseNumber', property.propertyHouseNumber);

    for (var i = 0; i < files.length; i++) {
      formData.append('propertyImages[]', files[i])
    }

    return this.http.post<any>(`${this.BASE_URL}/property-add`, formData)
      .pipe(
        tap(_ => console.log(`propery added`)),
        catchError(this.handleError<any>(`Error`))
      );
  }

  getPropertyTypeList(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL1}/property-type`)
      .pipe(
        tap( _ => console.log('Property List fetched!')),
        catchError(this.handleError<any>('Get Property List', []))
      );
  }

  getFeatureList(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL1}/property-features`)
      .pipe(
        tap( _ => console.log('Feature List fetched!')),
        catchError(this.handleError<any>('Get Feature List', []))
      );
  }

  searchproperty(property: Property): Observable<any> {
    let params = new HttpParams();
    if(property.profileID != undefined) {
      params = params.append('profileID', property.profileID);
    }
    if(property.propertyPurpose != undefined) {
      params = params.append('propertyPurpose', property.propertyPurpose);
    }
    if(property.propertyFor != undefined && property.propertyFor != "1") {
      params = params.append('propertyFor', property.propertyFor);
    } 
    if(property.propertyForDetails != undefined) {
      params = params.append('propertyForDetails', property.propertyForDetails);
    }
    if(property.propertyMinPrice != undefined) {
      params = params.append('propertyMinPrice', property.propertyMinPrice);
    }
    if(property.propertyMaxPrice != undefined) {
      params = params.append('propertyMaxPrice', property.propertyMaxPrice);
    }
    if(property.propertyAddress != undefined) {
      params = params.append('propertyAddress', property.propertyAddress);
    }
    if(property.propertyLocation != undefined) {
      params = params.append('propertyLocation', property.propertyLocation);
    }

    console.log(params);

    return this.http.get<any>(`${this.BASE_URL1}/property`, {params: params})
      .pipe(
        tap(_ => console.log(`Property searched:`)),
        catchError(this.handleError<any>(`Property searched`))
      );
  }

  getProperty(searchObj): Observable<any> {
    let params = new HttpParams();
    params = params.append('profileID', searchObj.profileID);
    params = params.append('propertyPurpose', searchObj.propertyPurpose);

    return this.http.get<any>(`${this.BASE_URL1}/property`, {params: params})
      .pipe(
        tap(_ => console.log(`Property list fetched:`)),
        catchError(this.handleError<any>(`Error: Property list not fetched`))
      );
  }

  getPropertydetails(id,profileid): Observable<any> {

    const formData = new FormData();
    formData.append('profileID', profileid);
    formData.append('propertyID', id);

    return this.http.post<any>(`${this.BASE_URL}/property-details` , formData)
      .pipe(
        tap(_ => console.log(`Property fetched: ${id}`)),
        catchError(this.handleError<any>(`Get Property id=${id}`))
      );
  }

  addtoWishlist(profileid, propertyid): Observable<any> {
    const formData = new FormData();
    formData.append('profileID', profileid);
    formData.append('propertyID', propertyid);

    return this.http.post<any>(`${this.BASE_URL}/add-to-wishlist`, formData)
      .pipe(
        tap(_ => console.log(`Property added towishlist:`)),
        catchError(this.handleError<any>(`Error: Property not added to wishlist`))
      );
  }

  removefromWishlist(profileid, propertyid): Observable<any> {
    const formData = new FormData();
    formData.append('profileID', profileid);
    formData.append('propertyID', propertyid);

    return this.http.post<any>(`${this.BASE_URL}/delete-wishlist`, formData)
      .pipe(
        tap(_ => console.log(`Property deleted from wishlist:`)),
        catchError(this.handleError<any>(`Error: Property not deleted from wishlist`))
      );
  }

  showWishlist(profileid): Observable<any> {
    const formData = new FormData();
    formData.append('profileID', profileid);

    return this.http.post<any>(`${this.BASE_URL}/wishlist`, formData)
      .pipe(
        tap(_ => console.log(`Wishlist fetched:`)),
        catchError(this.handleError<any>(`Error: wishlist`))
      );
  }

  getmyPropertylist(profileid): Observable<any> {
    const formData = new FormData();
    formData.append('profileID', profileid);

    return this.http.post<any>(`${this.BASE_URL}/properties`, formData)
      .pipe(
        tap(_ => console.log(`My Property fetched:`)),
        catchError(this.handleError<any>(`Error: My Property`))
      );
  }

  updatemyProperty(property: Property,files) {
    const formData = new FormData();
    formData.append('profileID', property.profileID);
    formData.append('propertyID', property.propertyID);
    formData.append('propertyPurpose', property.propertyPurpose);
    formData.append('propertyTypeID', property.propertyTypeID);
    formData.append('propertyName', property.propertyName);
    formData.append('propertyDescription', property.propertyDescription);
    formData.append('propertyAddress', property.propertyAddress);
    formData.append('propertyLocation', property.propertyLocation);
    formData.append('propertyBathrooms', property.propertyBathrooms);
    formData.append('propertyBedrooms', property.propertyBedrooms);
    if(property.propertyPurpose == "1") {
      formData.append('propertyOfferPrice', property.propertyRentPrice);
    } else {
      formData.append('propertyOfferPrice', property.propertySalePrice);
    }
    formData.append('propertyOwnership', property.propertyOwnership);
    formData.append('propertyFloor', property.propertyFloor);
    formData.append('propertyArea', property.propertyArea);
    formData.append('propertySize', property.propertySize);
    formData.append('propertyFeatures', property.propertyFeatures);
    formData.append('propertyFor', property.propertyFor);
    if(property.propertyForDetails != undefined) {
      formData.append('propertyForDetails', property.propertyForDetails);
    }
    formData.append('propertyContactNumber', property.propertyContactNumber);
    formData.append('propertyHouseNumber', property.propertyHouseNumber);
    
    if(files != undefined) {
      for (var i = 0; i < files.length; i++) {
        formData.append('propertyImages[]', files[i])
      }
    }

    return this.http.post<any>(`${this.BASE_URL}/property-edit`, formData)
      .pipe(
        tap(_ => console.log(`propery edited`)),
        catchError(this.handleError<any>(`Error: property edit.`))
      );
  }

  getSubscriptionplan(): Observable<any> {

    return this.http.get<any>(`${this.BASE_URL1}/subscription`)
      .pipe(
        tap(_ => console.log(`Subscription list fetched:`)),
        catchError(this.handleError<any>(`Error: Subscription list`))
      );
  }

  getmySubscriptionplan(profileid): Observable<any> {
    const formData = new FormData();
    formData.append('profileID', profileid);

    return this.http.post<any>(`${this.BASE_URL}/subscription/`, formData)
      .pipe(
        tap(_ => console.log(`My Subscription Plan fetched:`)),
        catchError(this.handleError<any>(`Error: Subscription Plan`))
      );
  }

  getmycurrentSubscriptionplan(profileid): Observable<any> {
    const formData = new FormData();
    formData.append('profileID', profileid);

    return this.http.post<any>(`${this.BASE_URL}/current-subscription/`, formData)
      .pipe(
        tap(_ => console.log(`My current Subscription Plan fetched:`)),
        catchError(this.handleError<any>(`Error: Current Subscription Plan`))
      );
  }

  addSubscriptionplan(profileid,subscriptionID,paymentID,paidAmount,paymentMode): Observable<any> {
    const formData = new FormData();
    formData.append('profileID', profileid);
    formData.append('subscriptionID', subscriptionID);
    formData.append('paymentID', paymentID);
    formData.append('paidAmount', paidAmount);
    formData.append('paymentMode', paymentMode);

    return this.http.post<any>(`${this.BASE_URL}/add-subscription/`, formData)
      .pipe(
        tap(_ => console.log(`Subscription Plan added:`)),
        catchError(this.handleError<any>(`Error: Subscription Plan added`))
      );
  }

  getcontactedlist(propertyid): Observable<any> {
    const formData = new FormData();
    formData.append('propertyID', propertyid);

    return this.http.post<any>(`${this.BASE_URL}/property-enquery`, formData)
      .pipe(
        tap(_ => console.log(`My Property contacted list fetched:`)),
        catchError(this.handleError<any>(`Error: My Property contacted list`))
      );
  }

  addtoContactedlist(profileid, propertyid, message, phone, email): Observable<any> {
    const formData = new FormData();
    formData.append('profileID', profileid);
    formData.append('propertyID', propertyid);
    formData.append('enqueryMessage', message);
    formData.append('enqueryPhone', phone);
    formData.append('enqueryEmail', email);

    return this.http.post<any>(`${this.BASE_URL}/add-enquery`, formData)
      .pipe(
        tap(_ => console.log(`Add to Contact list:`)),
        catchError(this.handleError<any>(`Error: Add to contact list`))
      );
  }

  getContactedlist(profileid): Observable<any> {
    const formData = new FormData();
    formData.append('profileID', profileid);

    return this.http.post<any>(`${this.BASE_URL}/enquery`, formData)
      .pipe(
        tap(_ => console.log(`Contact fetched:`)),
        catchError(this.handleError<any>(`Error: contactlist`))
      );
  }

  updateProfiles(profiles: Profiles): Observable<any> {

    const formData = new FormData();
    formData.append('profileID', profiles.profileID);
    formData.append('name', profiles.name);
    formData.append('email', profiles.email);
    if(profiles.password != undefined) {
      formData.append('password', profiles.password);
    }
    formData.append('address', profiles.address);
    formData.append('pincode', profiles.pincode);
    if(profiles.profile_image != undefined) {
      formData.append('profile_image', profiles.profile_image);
    }
    
    
    return this.http.post<any>(`${this.BASE_URL}/update-profile`, formData)
      .pipe(
        tap(_ => console.log(`Profiles updated:`)),
        catchError(this.handleError<Profiles[]>('Update Profile'))
      );
  }

  contactMessage(profiles: Profiles, profileid) {

    const formData = new FormData();
    formData.append('profileID', profileid);
    formData.append('name', profiles.name);
    formData.append('subject', profiles.subject);
    formData.append('message', profiles.message);

    return this.http.post<any>(`${this.BASE_URL1}/contact-us/send-email`, formData)
      .pipe(
        tap(_ => console.log(`Send contact message:`)),
        catchError(this.handleError<any>(`Error`))
      );
  }

  getAdminContact() {

    return this.http.get<any>(`${this.BASE_URL1}/contact-us`)
      .pipe(
        tap(_ => console.log(`Get contact info:`)),
        catchError(this.handleError<any>(`Error`))
      );
  }

  getAboutus() {

    return this.http.get<any>(`${this.BASE_URL1}/pages`)
      .pipe(
        tap(_ => console.log(`Get contact info:`)),
        catchError(this.handleError<any>(`Error`))
      );
  }

  propertyActiveDeactive(propertyid, profileid, activeFlag): Observable<any> {
    const formData = new FormData();
    formData.append('propertyID', propertyid);
    formData.append('profileID', profileid);
    formData.append('propertyStatus', activeFlag);

    return this.http.post<any>(`${this.BASE_URL}/property-status-update`, formData)
      .pipe(
        tap(_ => console.log(`Property activate/deactivate:`)),
        catchError(this.handleError<any>(`Error: Property not activate/deactivate`))
      );
  }

  propertyDelete(propertyid): Observable<any> {
    const formData = new FormData();
    formData.append('propertyID', propertyid);

    return this.http.post<any>(`${this.BASE_URL1}/property/delete`, formData)
      .pipe(
        tap(_ => console.log(`Property deleted:`)),
        catchError(this.handleError<any>(`Error: Property not deleted`))
      );
  }

  showLoader() {
    this.loadingController.create({
      spinner: 'circles',
      message: 'Please wait...'
    }).then((res) => {
      res.present();
    });
  }

  hideLoader() {
    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });
  }

  get isLoggedIn(): boolean {
    let loggedInFlag = localStorage.getItem('login');
    return (loggedInFlag !== null) ? true : false;
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}