import {Component} from '@angular/core';
import {NavController, Platform, AlertController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {DeliveryService} from "../../services/delivery-service";

declare var google: any;

@Component({
  selector: 'page-tracking',
  templateUrl: 'tracking.html'
})
export class TrackingPage {
  // map height
  public mapHeight: number = 710;
  // map
  public map: any;
  public deliverName = '';
  public valoration = '';
  public vehicleId = '';
  public deliveryPending: boolean = true;

  constructor(public nav: NavController, public platform: Platform,
              public alertCtrl: AlertController, public deliveryService: DeliveryService) {

    setInterval(() => this.tick(), 3000);
  }

  ionViewDidLoad() {

    this.initializeMap();
  }

  loadPendingDeliverys() {

    const ref = this;

    this.deliveryService.loadPendingDeliverys().subscribe(result => {

      if (result.length > 0) {
        ref.deliveryPending = true;
      } else {
        ref.deliveryPending = false;
        ref.loadAttendedDelivery();
      }

    });

  }

  tick() {

    if (this.deliveryPending) {
      this.loadPendingDeliverys();
    }

  }

  loadAttendedDelivery(){

    const ref = this;

    this.deliveryService.attendedDeliveryByUserClient().subscribe(result => {

      if (result.length > 0) {
        ref.valoration = '3.8';
        ref.vehicleId = result[0].userResponse.vehicleId;
        ref.deliverName = result[0].userResponse.name;
      }

    });

  }


  initializeMap() {

    let latLng = new google.maps.LatLng(this.deliveryService.deliverSaved.latitude, this.deliveryService.deliverSaved.longitude);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false
    };

    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    this.map.setCenter(latLng);
    new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 300);
  }

  showRating() {
    let prompt = this.alertCtrl.create({
      title: 'Thank you',
      message: 'We hope you have enjoyed your ride, For comments, compliments or enquiries, please write to us below',
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.nav.setRoot(HomePage);
          }
        }
      ]
    });

    prompt.present();
  }
}
