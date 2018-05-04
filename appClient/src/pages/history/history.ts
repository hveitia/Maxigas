import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {DeliveryService} from "../../services/delivery-service";


/*
  Generated class for the HistoryPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {
  // history records
  public records:any;

  constructor(public nav: NavController,public deliveryService: DeliveryService) {

  }

  ionViewDidLoad() {
    this.loadPendingDeliverys();
  }

  createDeliveryText(element, index, array) {

    if(element.type === 'GAS'){
      element.delivery = 'Solicitud de 1 cilindro de Gas';
    }else{
      element.delivery = 'Botellon de Agua';
    }
  }

  loadPendingDeliverys(){

    this.deliveryService.loadPendingDeliverys().subscribe(data =>{

      this.records = data;

      this.records.forEach(this.createDeliveryText);

    },error => {

    });
  }

  cancelDelivery(delivery){

    this.deliveryService.cancelDelivery(delivery._id).subscribe(data =>{

     this.loadPendingDeliverys();

    },error => {

    });
  }
}
