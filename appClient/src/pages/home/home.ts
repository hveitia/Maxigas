import {Component, OnDestroy} from '@angular/core';
import {AlertController, NavController, Platform} from 'ionic-angular';
import {PlacesPage} from '../places/places';
import {ToastController} from 'ionic-angular';
import {PlaceService} from "../../services/place-service";
import {Subscription} from "rxjs/Subscription";
import {UserService} from "../../services/user-service";
import {DeliveryService} from "../../services/delivery-service";
import {Geolocation} from '@ionic-native/geolocation';
import {TrackingPage} from "../tracking/tracking";
import {CONFIGS} from "../../configs/configs";


declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnDestroy {

  // map id
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
  // map height
  public mapHeight: number = 480;

  // show - hide booking form
  public showForm: boolean = false;

  // show - hide modal bg
  public showModalBg: boolean = false;

  // Note to driver
  public note: any;

  // Map
  public map: any;

  public marker: any;

  public addressSelected: boolean = false;

  constructor(public nav: NavController, public platform: Platform,
              public placeService: PlaceService, public deliveryService: DeliveryService,
              public userService: UserService, public toastCtrl: ToastController,
              public geolocation: Geolocation, public alertCtrl: AlertController) {
  }

  ngOnDestroy() {

    if (this.subscription)
      this.subscription.unsubscribe();
  }

  verifyAddresSaved() {

    const ref = this;
    let array = this.userService.userLogued.addressList.filter(function (x) {
      return x.name == ref.nombreDireccion && x.address == ref.descripcionDireccion;
    });

    return array.length > 0;

  }

  ionViewDidLoad() {

    this.initializeMap();
  }

  ionViewDidEnter() {

    this.subscription = this.placeService.getPlace().subscribe(place => {

      this.nombreDireccion = place.name;
      this.descripcionDireccion = place.address;
      this.addressNumber = place.number;
      this.disabledNumber = place.number !== '';
      this.setCenterToAddress(place);
      this.addressSelected = !this.verifyAddresSaved();


    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.showModalBg = (this.showForm == true);
    this.mensajeServicio = '';
  }

  toggleVehicle(s) {
    if (this.addressNumber === '') {
      this.showAlert('Por favor ingrese un número.');
    } else {
      switch (s) {
        case 'gas': {
          this.deliveryType = 'GAS';
          this.datosDelivery = 'Solicitar 1 cilindro de gas..';
        }
          break;
        case 'agua': {
          this.deliveryType = 'AGUA';
          this.datosDelivery = 'Solicitar 1 botellón de agua..';
        }
          break;
      }

      this.showForm = !this.showForm;
      this.showModalBg = (this.showForm == true);
      this.mensajeServicio = '';

    }

  }

  initializeMap() {

    let latLng = new google.maps.LatLng(-0.130277, -78.4949158);
    let mapOptions = {
      center: latLng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false
    };

    this.map = new google.maps.Map(document.getElementById(this.mapId), mapOptions);
    let viewHeight = window.screen.height - 44;//44
    let infoHeight = document.getElementsByClassName('booking-info')[0].scrollHeight;
    let bookingHeight = document.getElementsByClassName('booking-form')[0].scrollHeight;
    this.mapHeight = viewHeight - infoHeight + bookingHeight;

    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 300);


    if (CONFIGS.enviroment == 'PROD') {
      this.geolocation.getCurrentPosition().then((resp) => {

        let newLatLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        this.map.setCenter(newLatLng);
        this.placeService.currentPos = newLatLng;

        this.marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: this.map.getCenter()
        });

        this.setDefaultValues();

      }).catch((error) => {
        console.log('Error getting location', error);
      });
    } else {

      this.map.setCenter(latLng);
      this.placeService.currentPos = latLng;

      this.marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

      this.setDefaultValues();
    }


  }

  // Confirmar Pedido
  book() {

    const ref = this;
    const delivery = {
      type: this.deliveryType,
      latitude: this.marker.position.lat(),
      longitude: this.marker.position.lng(),
      address: this.descripcionDireccion + ' - ' + this.addressNumber
    };

    this.deliveryService.addDelivery(delivery).subscribe(data => {

      this.toggleForm();

      this.shoowConfirmationsMsj('Su pedido se ha registrado correctamente.');
      //this.setDefaultValues();

      ref.deliveryService.deliverSaved = delivery;

      ref.nav.push(TrackingPage);

    }, error => {

      this.shoowConfirmationsMsj('Su pedido no se ha registrado. ' + error);

    });

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

  choosePlace() {
    this.addressNumber = '';
    this.disabledNumber = false;
    this.nav.push(PlacesPage);
  }

  setDefaultValues() {

    this.nombreDireccion = 'Dirección de entrega.';
    this.descripcionDireccion = 'Seleccione la dirección de entrega.';

    this.placeService.getPlaceAddressLiteralFromGoogle(this.map.center.lat(), this.map.center.lng()).subscribe(data => {

        const placeSelected = {
          name: "Direccion Seleccionada",
          address: data.results[0].formatted_address,
          lat: this.map.center.lat(),
          long: this.map.center.lng()
        };

        this.nombreDireccion = "Direccion Seleccionada";
        this.descripcionDireccion = placeSelected.address;
        this.addressNumber = '';
        this.loading = false;

      },
      error => {
        console.log(error)
      }
    );
  }

  setCenterToAddress(place: any) {

    this.deleteMarkers();
    let newCenter = new google.maps.LatLng(place.lat, place.long);
    this.map.setCenter(newCenter);

    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

  }

  deleteMarkers() {
    this.marker.setMap(null);
  }

  addAddress() {
    this.savingAddres = true;
  }

  cancelAddAddress() {
    this.addresNameToSave = '';
    this.savingAddres = false;
  }

  addAddressToServer() {
    if (this.addressNumber === '') {

      this.showAlert('Por favor ingrese un número.');

    } else {
      if (this.addresNameToSave === '') {

        this.showAlert('Por favor ingrese un nombre para su dirección.');

      } else {

        const ref = this;
        const address = {
          name: this.addresNameToSave,
          address: this.descripcionDireccion,
          lat: this.marker.position.lat(),
          long: this.marker.position.lng(),
          number: this.addressNumber,
        };

        this.userService.addAddress(address).subscribe(data => {
            ref.nombreDireccion = ref.addresNameToSave;
            ref.cancelAddAddress();
            ref.shoowConfirmationsMsj('Dirección guardada.');
          },
          error => {
            ref.shoowConfirmationsMsj('Su dirección no pudo ser guardada. ' + error);
          }
        );
      }
    }
  }
}
