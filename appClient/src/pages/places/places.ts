import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PlaceService} from '../../services/place-service';
import {UserService} from "../../services/user-service";

declare var google: any;

@Component({
  selector: 'page-places',
  templateUrl: 'places.html'
})
export class PlacesPage {

  // all places
  public places: Array<any>;
  public mapId = Math.random() + 'map';
  public mapHeight: number = 100;
  public map: any;
  public marker: any;
  public moving: boolean = false;
  public isNew: boolean = false;

  constructor(public nav: NavController, public placeService: PlaceService, public userService: UserService) {

    this.places = new Array<any>();
  }

  ionViewDidLoad() {

    this.initializeMap();
    this.getPlacesAll();
  }

  choosePlace(place) {

    this.placeService.selectPlace(place);
    this.nav.pop();

  }

  choosePlaceInMap() {

    this.isNew = true;
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.placeService.currentPos
    });

  }

  fixCenter() {

    this.deleteMarkers();

    this.map.panTo(this.placeService.currentPos);

    this.marker = new google.maps.Marker({
      map: this.map,
      animation: null,
      position: this.map.getCenter()
    });

    this.map.setCenter(this.placeService.currentPos);

  }

  initializeMap() {

    const ref = this;

    let latLng = this.placeService.currentPos;

    let mapOptions = {
      center: latLng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false
    };

    this.map = new google.maps.Map(document.getElementById(this.mapId), mapOptions);

    var viewHeight = window.screen.height - 44;//44
    var infoHeight = document.getElementsByClassName('booking-info')[0].scrollHeight;
    var bookingHeight = document.getElementsByClassName('booking-form')[0].scrollHeight;


    // refresh map
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 300);

    this.map.setCenter(this.placeService.currentPos);

    this.map.addListener('drag', function () {
      ref.moving = true;
    });

    this.map.addListener('dragend', function () {
      ref.moving = false;
    });

    this.map.addListener('click', function (e) {

      if (ref.isNew) {

        ref.deleteMarkers();
        ref.marker = new google.maps.Marker({
          map: ref.map,
          animation: null,
          position: e.latLng
        });

        ref.map.panTo(e.latLng);
      }

      console.log(e.latLng);
    });
  }

  deleteMarkers() {
    this.marker.setMap(null);
  }

  selectPlace() {

    this.placeService.getPlaceAddressLiteralFromGoogle(this.map.center.lat(), this.map.center.lng()).subscribe(data => {

        const placeSelected = {
          name: "Direccion Seleccionada",
          address: data.results[0].formatted_address,
          lat: this.map.center.lat(),
          long: this.map.center.lng(),
          number: ''
        };

        this.placeService.selectPlace(placeSelected);
        this.nav.pop();
      },
      error => console.log(error)
    );


  }

  getPlacesAll() {
    this.userService.getPlacesAll().subscribe(data => {

        this.places = data;
      },
      error => console.log(error)
    );
  }
}
