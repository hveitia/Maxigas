import {Component, OnDestroy} from '@angular/core';
import {AlertController, NavController, Platform} from 'ionic-angular';
import {ToastController} from 'ionic-angular';
import {PlaceService} from "../../services/place-service";
import {Subscription} from "rxjs/Subscription";
import {UserService} from "../../services/user-service";
import {DeliveryService} from "../../services/delivery-service";
import {Geolocation} from '@ionic-native/geolocation';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnDestroy {

  public mapId = Math.random() + 'map';
  public mensajeServicio: string = '';
  public nombreDireccion: string = '';
  public descripcionDireccion: string = '';
  public subscription: Subscription;
  public savingAddres: boolean = false;
  public addresNameToSave: string = '';
  public loading: boolean = true;
  public datosDelivery: string = '';
  public deliveryType: string = '';
  public addressNumber: string = '';
  public disabledNumber: boolean = false;
  public mapHeight: number = 480;
  public showForm: boolean = false;
  public note: any;
  public map: any;
  public markersPendingDeliverys: Array<any>;
  public markersGM: Array<any>;
  public addressSelected = false;
  public isOnline: boolean;
  public firstLoaded = false;
  public attendedDeliverys = new Array<any>();
  public markerMe: any;
  public mode = '';
  public directionsService: any;
  public directionsDisplay: any;
  public showCancelControl = false;
  public cancelValue = 0;

  constructor(public nav: NavController, public platform: Platform,
              public placeService: PlaceService, public deliveryService: DeliveryService,
              public userService: UserService, public geolocation: Geolocation,
              public alertCtrl: AlertController, public toastCtrl: ToastController) {

    this.markersPendingDeliverys = [];
    this.markersGM = [];
  }

  ngOnDestroy() {

    if (this.subscription)
      this.subscription.unsubscribe();
  }

  ionViewDidLoad() {
    this.isOnline = this.userService.userLogued.distributionStatus == 'ONLINE';
    this.initializeMap();
    setInterval(() => this.tick(), 5000);
    setInterval(() => this.showRoute(), 5000);
  }

  ionViewDidEnter() {

  }

  tick() {
    if (this.isOnline && this.firstLoaded) {
      this.loadPendingDeliverys();
    }
  }

  initializeMap() {

    let latLng = new google.maps.LatLng(-0.130277, -78.4949158);
    let mapOptions = {
      center: latLng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false
    };

    this.map = new google.maps.Map(document.getElementById(this.mapId), mapOptions);
    const viewHeight = window.screen.height - 44;//44
    const infoHeight = document.getElementsByClassName('booking-info')[0].scrollHeight;
    this.mapHeight = viewHeight - infoHeight;

    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 300);

    //Current Position
    this.geolocation.getCurrentPosition().then((resp) => {

      let newLatLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.map.setCenter(newLatLng);
      this.placeService.currentPos = newLatLng;

      this.markerMe = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter(),
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });


      this.directionsService = new google.maps.DirectionsService;
      this.directionsDisplay = new google.maps.DirectionsRenderer;
      this.directionsDisplay.setOptions({suppressMarkers: true});

      this.deliveryService.attendedDeliveryByUserDistrib().subscribe(data => {

        if (data.length > 0) {

          this.mode = 'ATTENDING';

          const marketToAdd = new google.maps.Marker({
            map: this.map,
            animation: '',
            position: new google.maps.LatLng(data[0].latitude, data[0].longitude),
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          });

          this.markersGM.push(marketToAdd);

          this.deliveryService.deliveryAttended = data[0];

        } else {
          this.mode = 'FINDING';
          this.loadPendingDeliverys();
        }

      }, error => {
        console.log(error);
      });


    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  showRoute() {

    const ref = this;
    if (this.mode == 'ATTENDING') {

      this.geolocation.getCurrentPosition().then((resp) => {

        this.directionsService.route({
          origin: {lat: resp.coords.latitude, lng: resp.coords.longitude},
          destination: {lat: this.markersGM[0].position.lat(), lng: this.markersGM[0].position.lng()},
          waypoints: [],
          travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            ref.directionsDisplay.setMap(null);
            ref.directionsDisplay.setMap(ref.map);
            ref.directionsDisplay.setDirections(response);
          } else {

          }
        });

      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }
  }

  changeStatus() {

    this.userService.changeDistributionStatus(this.isOnline ? 'ONLINE' : 'OFFLINE').subscribe(result => {

      if (this.isOnline) {
        this.shoowConfirmationsMsj('A partir de este momento usted podrá atender las solicitudes pendientes..');
      } else {
        this.shoowConfirmationsMsj('A partir de este momento usted NO podrá atender las solicitudes pendientes..');
        this.deleteAllMarkers();
      }

    }, error => console.log(error));
  }

  book() {
  }

  deleteAllMarkers() {

    this.markersGM.forEach(element => {

      let finded = false;
      this.attendedDeliverys.forEach(function (x) {

        if (element.position.lat() == x.lat && element.position.lng() == x.lng) {
          finded = true;
        }
      });

      if (!finded)
        element.setMap(null);

    });
  }

  loadPendingDeliverys() {

    const ref = this;

    this.deliveryService.loadPendingDeliverys().subscribe(result => {

      ref.deleteAllMarkers();

      if (this.markersPendingDeliverys.length > 0) {
        this.markersPendingDeliverys = [];
      }

      result.forEach(element => {

        this.markersPendingDeliverys.push({
          lat: element.latitude,
          lng: element.longitude,
          label: '',
          draggable: false,
          date: element.date,
          state: element.state,
          type: element.type,
          userRequest: {},
          address: element.address,
          id: element._id
        });

        const marketToAdd = new google.maps.Marker({
          map: this.map,
          animation: '',
          position: new google.maps.LatLng(element.latitude, element.longitude),
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        this.markersGM.push(marketToAdd);

        marketToAdd.addListener('click', function () {
          ref.clickMarkerHandler(marketToAdd);
        });

      });

      ref.firstLoaded = true;
    });

  }

  clickMarkerHandler(marker: any): void {

    const objFinded = this.markersPendingDeliverys.find(function (m) {
      return marker.position.lat() == m.lat && marker.position.lng() == m.lng;
    });

    let alert = this.alertCtrl.create({
      title: 'Solicitud Pendiente.',
      message: 'Fecha: ' + objFinded.date.split('T')[0] + ' ' + objFinded.date.split('T')[1].split('.')[0]
      + ' Dirección: ' + objFinded.address,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Atender',
          handler: () => {

            this.attendDelivery(objFinded);
          }
        }
      ]
    });
    alert.present();
  }

  attendDelivery(objFinded: any): void {

    const ref = this;
    this.deliveryService.attendDelivery(objFinded.id).subscribe(result => {

      ref.shoowConfirmationsMsj('Usted atenderá la solicitud.');

      ref.attendedDeliverys.push(objFinded);

      this.mode = 'ATTENDING';
      this.firstLoaded = false;
      this.deliveryService.deliveryAttended = objFinded;
      this.markersGM.forEach(function (x) {
        if(x.icon == 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'){
          x.setMap(null);
        }
      });

      this.markersGM = [];

      const marketToAdd = new google.maps.Marker({
        map: this.map,
        animation: '',
        position: new google.maps.LatLng(objFinded.lat, objFinded.lng),
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });

      this.markersGM.push(marketToAdd);

    }, error => console.log(error));

  }

  shoowConfirmationsMsj(msj: string) {

    let toast = this.toastCtrl.create({
      message: msj,
      duration: 5000,
      position: 'middle',
      showCloseButton: true,
      closeButtonText: 'Ok',
      dismissOnPageChange: true
    });
    toast.present();

  }

  showAlert(msj: string, title = 'Estimado Usuario') {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msj,
      buttons: ['OK']
    });
    alert.present();
  }

  deleteMarkers() {

  }

  successDelivery() {

    const ref = this;
    const id = this.deliveryService.deliveryAttended._id ? this.deliveryService.deliveryAttended._id : this.deliveryService.deliveryAttended.id;
    this.deliveryService.successDelivery(id).subscribe(result => {

      ref.shoowConfirmationsMsj('Su entrega se ha concretado de manera exitosa.');

      this.directionsDisplay.setMap(null);
      this.deliveryService.deliveryAttended = {};
      this.markersGM.forEach(function (x) {
        if(x.icon == 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'){
          x.setMap(null);
        }
      });

      this.markersGM = [];
      this.mode = 'FINDING';
      this.loadPendingDeliverys();

    }, error => console.log(error));
  }

  cancelarCLick() {
    this.showCancelControl = true;
  }

  canceling(){

    if(this.cancelValue == 100){
      alert('Pedido cancelado');
    }

  }


}
