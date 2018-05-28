import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CONFIGS} from "../configs/configs";
import {UserService} from "./user-service";


@Injectable()
export class DeliveryService {

  public deliveryAttended: any;

  constructor(private http: HttpClient, private userService: UserService) {

  }

  getAll() {
    return [];
  }

  loadPendingDeliverys(): any {
    return this.http.get(CONFIGS.urlServices + 'deliveryByState/PENDING', {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': this.userService.accessToken
        }
      )
    });
  }

  loadMyDeliverysToAttend(): any {
    return this.http.get(CONFIGS.urlServices + 'pendingDeliveryByUser', {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': this.userService.accessToken
        }
      )
    });
  }

  attendedDeliveryByUserDistrib(): any {
    return this.http.get(CONFIGS.urlServices + 'attendedDeliveryByUserDistrib', {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': this.userService.accessToken
        }
      )
    });
  }

  addDelivery(delivery: any): any {
    return this.http.post(CONFIGS.urlServices + 'delivery', delivery, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': this.userService.accessToken
        }
      )
    });
  }

  attendDelivery(deliveryId: any): any {
    return this.http.get(CONFIGS.urlServices + 'attendDelivery/'+ deliveryId, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': this.userService.accessToken
        }
      )
    });
  }

  successDelivery(deliveryId: any): any {
    return this.http.get(CONFIGS.urlServices + 'successDelivery/'+ deliveryId, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': this.userService.accessToken
        }
      )
    });
  }

}
