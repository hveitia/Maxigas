import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

// import pages
import {LoginPage} from '../pages/login/login';
import {RegisterPage} from "../pages/register/register";
import {HomePage} from '../pages/home/home';
import {HistoryPage} from '../pages/history/history';
import {NotificationPage} from '../pages/notification/notification';
import {SupportPage} from '../pages/support/support';
import {UniqueDeviceID} from "@ionic-native/unique-device-id";
import {UserService} from "../services/user-service";
import {CONFIGS} from "../../../appClient/src/configs/configs";

@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {

  public rootPage: any;
  public nav: any;

  public pages = [
    {
      title: 'Mapa',
      icon: 'md-map',
      count: 0,
      component: HomePage
    },
    {
      title: 'Lista de solicitudes',
      icon: 'md-list',
      count: 0,
      component: HistoryPage
    }
  ];

  constructor(platform: Platform, statusBar: StatusBar, private uniqueDeviceID: UniqueDeviceID,
              public userService: UserService, public splashScreen: SplashScreen) {

    if (CONFIGS.enviroment == 'PROD') {
      platform.ready().then(() => {

        statusBar.styleDefault();

        this.uniqueDeviceID.get()
          .then((uuid: any) => {
            this.userService.uuid = uuid;
            this.login();
          })
          .catch((error: any) => console.log(error));
      });

    }else{
      this.login();
    }
  }



  goToHome() {
    this.nav.setRoot(HomePage);
    this.splashScreen.hide();
  }

  createUserLogued(userLogued) {
    if (userLogued.success) {
      this.userService.userLogued = userLogued.user;
      this.userService.accessToken = 'Bearer ' + userLogued.token;
      this.goToHome();
    }
  }

  login() {

    const uuid = {
      uuid: CONFIGS.enviroment == 'PROD' ? this.userService.uuid : '5b72-1e7a-e359-058060854812'
    };

    this.userService.login(uuid).subscribe(data => {
        if (data.success) {
          this.createUserLogued(data)
        } else {
          this.rootPage = RegisterPage;
          this.splashScreen.hide();
        }
      },
      error => console.log(error)
    );

    //this.nav.setRoot(LoginPage);
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}


