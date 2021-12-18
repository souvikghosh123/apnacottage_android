import { Component, OnInit } from '@angular/core';
import { PropertyService } from './../shared/property.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
declare var RazorpayCheckout:any;

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

  profileid: any;
  alldata: any;
  buttonDisabled = false;
  name: any;
  mobile: any;
  email: any;
  successFlag = false;
  temp_paymentID: any;
  temp_paymentMode = "2";
  subscriptionPrice = 0;
  subscriptionID: any;
  currentDate: any;
  subscriptionName: any;
  descriptionFlag = 0;
  subscriptionDescription: any;
  subscriptionPropertyNo: any;
  result: any;
  temp_data: any;

  constructor(
    private profileService: PropertyService,
    private router: Router,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.getCurrentDate();
  }

  ionViewWillEnter() {
    this.storage.get('profileid').then((val) => {
      this.profileid = val;
      console.log(this.profileid);
      this.profileService.showLoader();
      this.profileService.getProfiles(this.profileid).subscribe((res) => {   
        console.log(res);
        this.name = res.data.name;
        this.mobile = res.data.mobile;
        this.email = res.data.email;
        this.profileService.getSubscriptionplan().subscribe((res) => {
          console.log(res);
          this.alldata = res.data;
          this.profileService.getmycurrentSubscriptionplan(this.profileid).subscribe((resp) => {
            this.profileService.hideLoader();
            console.log(resp);
            if(resp == undefined) {
              this.buttonDisabled = false;
            } else {
              console.log(resp.data.remainingProperty);
              if(resp.data.remainingProperty == "0") {
                this.buttonDisabled = false;
              } else {
                this.buttonDisabled = true;
              }
            }
          });
          for(let i=0;i<this.alldata.length;i++) {
            this.alldata[i].status = false;
          }
          console.log(this.alldata);
        });
      })  
    });
  }


  showPrice(index, record) {
    for(let i=0;i<this.alldata.length;i++) {
      this.alldata[i].status = false;
    }
    this.alldata[index].status = true;
    this.descriptionFlag = 1;
    this.subscriptionID = record.subscriptionID;
    this.subscriptionPrice = record.subscriptionAmount;
    this.subscriptionName = record.subscriptionName;
    this.subscriptionDescription = record.subscriptionDescription;
    this.subscriptionPropertyNo = record.subscriptionPropertyNo;
  }

  payWithRazorpay() {
    var options = {
      description: 'Property',
      image: 'https://homerent.developerconsole.xyz/uploads/property24.jpg',
      currency: "INR", // your 3 letter currency code
      key: "rzp_live_I7dD2QjaBXm1Oc", // your Key Id from Razorpay dashboard
      amount: this.subscriptionPrice + "00", // Payment amount in smallest denomiation e.g. cents for USD
      name: 'Razorpay',
      prefill: {
        email: this.email,
        contact: "91" + this.mobile,
        name: this.name
      },
      theme: {
        color: '#F37254'
      },
      modal: {
        ondismiss: function () {
          alert('dismissed')
        }
      }
    };

    var successCallback = (success)=> {
      console.log(success);
      this.temp_paymentID = success.razorpay_payment_id;
      this.successFlag = true;
      this.profileService.addSubscriptionplan(this.profileid,this.subscriptionID,this.temp_paymentID,this.subscriptionPrice,this.temp_paymentMode).subscribe((res) => {
        console.log(res);
        this.router.navigate(['/mysubscription']);
      });
    };

    var cancelCallback = (error)=> {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.on('payment.success', successCallback)
    RazorpayCheckout.on('payment.cancel', cancelCallback)
    RazorpayCheckout.open(options);
  }

  getCurrentDate() {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-GB', 
    {day: '2-digit', month: 'short', year: 'numeric'}); 
    var res = formattedDate.split(" ");
    this.currentDate = res[0] + ' ' + res[1] + ',' + res[2];
  }


}
