import {Component} from '@angular/core';
import {NavController, Platform, AlertController, ToastController} from 'ionic-angular';
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
  public deliveryPending = true;
  public mode = '';
  public valorationDelivery = 1;

  constructor(public nav: NavController, public platform: Platform, public toastCtrl: ToastController,
              public alertCtrl: AlertController, public deliveryService: DeliveryService) {

    if(this.deliveryService.deliveryAttended){
      this.deliveryPending = false;
      this.mode = 'WAITING';
      this.valoration = '3.8';
      this.vehicleId = this.deliveryService.deliverSaved.userResponse.vehicleId;
      this.deliverName = this.deliveryService.deliverSaved.userResponse.name;
    }

    setInterval(() => this.tick(), 3000);
    setInterval(() => this.sheckOnSiteSuccess(), 3000);

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
        ref.mode = 'WAITING';
        ref.loadAttendedDelivery();
      }

    });

  }

  tick() {

    if (this.deliveryPending) {
      this.loadPendingDeliverys();
    }

  }

  sheckOnSiteSuccess() {

    const ref = this;
    if(ref.mode == 'WAITING'){

      this.deliveryService.onSiteDeliveryByUserClient().subscribe(result => {

        if(result.length > 0 )
        {
          ref.mode = 'ONSITE';
          let alert = this.alertCtrl.create({
            title: 'Estimado usuario',
            subTitle: 'El distribuidor que atendió su pedido está en el sitio indicado.',
            buttons: ['OK']
          });
          alert.present();
        }

      });
    }

    if(ref.mode == 'WAITING' || ref.mode == 'ONSITE'){

      this.deliveryService.successDeliveryByUserClient().subscribe(result => {

        if(result.length > 0 )
        {
          ref.mode = 'SUCCESS';
        }

      });
    }

  }

  loadAttendedDelivery(){

    const ref = this;

    this.deliveryService.attendedDeliveryByUserClient().subscribe(result => {

      const obj = result.find(x => x._id ==  this.deliveryService.deliverSaved._id);

      if (result.length > 0) {
        ref.valoration = '3.8';
        ref.vehicleId = obj.userResponse.vehicleId;
        ref.deliverName = obj.userResponse.name;
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

  goHome(){

    this.deliveryPending = false;
    this.nav.setRoot(HomePage);
  }

  cancelDelivery(){

    this.deliveryPending = false;

    this.deliveryService.cancelDelivery(this.deliveryService.deliverSaved._id).subscribe(data => {

      let toast = this.toastCtrl.create({
        message: 'Pedido cancelado con éxito.',
        duration: 20000,
        position: 'middle',
        showCloseButton: true,
        closeButtonText: 'Ok',
        dismissOnPageChange: true
      });
      toast.present();

      this.nav.setRoot(HomePage);

    },error => {

      console.log(error);

    });

  }

  valorateDelivery() {

    this.deliveryService.addValoration(this.deliveryService.deliverSaved._id, this.valorationDelivery/20).subscribe(data=>{

      this.goHome();
    }, error => {
      console.log(error);
    });


  }
}
