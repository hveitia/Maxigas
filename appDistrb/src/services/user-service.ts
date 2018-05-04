import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/do';
import {CONFIGS} from "../configs/configs";

@Injectable()
export class UserService {


  public accessToken: any;
  public userLogued: any;
  public uuid: string;
  public places: Array<any>;

  constructor(private http: HttpClient) {

  }

  getPlacesAll():any {
    return this.http.get(CONFIGS.urlServices + 'addresByUser/' + this.userLogued._id, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': this.accessToken
        }
      )
    });
  }

  changeDistributionStatus(distributionStatus) {
    return this.http.put(CONFIGS.urlServices + 'changeDistributionStatus/' + this.userLogued._id, {distributionStatus: distributionStatus}, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': this.accessToken
        }
      )
    });
  };

  register(user: any) {
    return this.http.post(CONFIGS.urlServices + 'user', user);
  }

  login(uuid: any): any {
    return this.http.post(CONFIGS.urlServices + 'authenticateuuid', uuid);
  }

  addAddress(address: any) {
    return this.http.put(CONFIGS.urlServices + 'userAddAddress/' + this.userLogued._id, address, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': this.accessToken
        }
      )
    });
  }


}
