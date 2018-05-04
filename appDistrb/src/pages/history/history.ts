import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DeliveryService} from "../../services/delivery-service";

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {

  public deliverysList: Array<any>;

  constructor(public nav: NavController, public deliveryService: DeliveryService) {

    this.deliverysList = new Array<any>();
  }

  ionViewDidLoad() {

    const ref = this;
    this.deliveryService.loadMyDeliverysToAttend().subscribe(result => {

      ref.deliverysList = result;

    });

  }

  cancelDelivery(item) {

  }
}
