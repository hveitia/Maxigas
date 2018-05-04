import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {CONFIGS} from '../configs/configs'

// import pages
import {LoginPage} from '../pages/login/login';
import {RegisterPage} from "../pages/register/register";
import {HomePage} from '../pages/home/home';
import {HistoryPage} from '../pages/history/history';
import {NotificationPage} from '../pages/notification/notification';
import {SupportPage} from '../pages/support/support';
import {UniqueDeviceID} from "@ionic-native/unique-device-id";
import {UserService} from "../services/user-service";

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
      title: 'Home',
      icon: 'ios-home-outline',
      count: 0,
      component: HomePage
    },
    {
      title: 'Solicitudes Pendientes',
      icon: 'ios-time-outline',
      count: 0,
      component: HistoryPage
    },
    {
      title: 'Reservar',
      icon: 'ios-calendar-outline',
      count: 0,
      component: NotificationPage
    },
    // {
    //   title: 'Support',
    //   icon: 'ios-help-circle-outline',
    //   count: 0,
    //   component: SupportPage
    // },
    // {
    //   title: 'Logout',
    //   icon: 'ios-log-out-outline',
    //   count: 0,
    //   component: LoginPage
    // }
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

    }
    else {
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
      uuid: CONFIGS.enviroment == 'PROD' ? this.userService.uuid : '0b631db7-5b72-1e7a-e359-058060854812'
    };

    this.userService.login(uuid).subscribe(data => {

        if (data.success) {

          this.createUserLogued(data)
        } else {

          this.rootPage = RegisterPage;
          this.splashScreen.hide();
        }
      },
      error => {
        alert(error.message);
      }
    );

    //this.nav.setRoot(LoginPage);
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}


