import {Injectable} from "@angular/core";
import {PLACES} from "./mock-places";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class PlaceService {
  private places: Array<any>;
  private subject = new Subject<any>();
  public currentPos: any;

  constructor(private http: HttpClient) {
    this.places = new Array<any>();

    PLACES.map(obj => {
      this.places.push(obj);
    });

  }

  getAll() {
    return this.places;
  }

  selectPlace(place: any) {
    this.subject.next(place);
  }

  clearPlace() {
    this.subject.next();
  }

  getPlace(): Observable<any> {
    return this.subject.asObservable();
  }

  getPlaceAddressLiteralFromGoogle(lat, long): any {

    const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=AIzaSyDzS5tsojBaUinS8uFsxpvQp3YCGmlL2ww';

    return this.http.get(url);
  }

}
