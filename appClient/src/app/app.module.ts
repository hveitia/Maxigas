import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HttpClientModule} from '@angular/common/http';
import {Geolocation} from '@ionic-native/geolocation';
import {UniqueDeviceID} from '@ionic-native/unique-device-id';

// import services
import {DriverService} from '../services/driver-service';
import {DeliveryService} from '../services/delivery-service';
import {PlaceService} from '../services/place-service';
import {UserService} from "../services/user-service";
// end import services

// import pages
import {DriverPage} from '../pages/driver/driver';
import {FindingPage} from '../pages/finding/finding';
import {HistoryPage} from '../pages/history/history';
import {HomePage} from '../pages/home/home';
import {LoginPage} from '../pages/login/login';
import {ModalRatingPage} from '../pages/modal-rating/modal-rating';
import {NotificationPage} from '../pages/notification/notification';
import {PaymentMethodPage} from '../pages/payment-method/payment-method';
import {PlacesPage} from '../pages/places/places';
import {ProfilePage} from '../pages/profile/profile';
import {RegisterPage} from '../pages/register/register';
import {SupportPage} from '../pages/support/support';
import {TrackingPage} from '../pages/tracking/tracking';
import {FormsModule} from "@angular/forms";
// end import pages

@NgModule({
  declarations: [
    MyApp,
    DriverPage,
    FindingPage,
    HistoryPage,
    HomePage,
    LoginPage,
    ModalRatingPage,
    NotificationPage,
    PaymentMethodPage,
    PlacesPage,
    ProfilePage,
    RegisterPage,
    SupportPage,
    TrackingPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DriverPage,
    FindingPage,
    HistoryPage,
    HomePage,
    LoginPage,
    ModalRatingPage,
    NotificationPage,
    PaymentMethodPage,
    PlacesPage,
    ProfilePage,
    RegisterPage,
    SupportPage,
    TrackingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DriverService,
    DeliveryService,
    PlaceService,
    UserService,
    Geolocation,
    UniqueDeviceID,
    /* import services */
  ]
})
export class AppModule {
}
