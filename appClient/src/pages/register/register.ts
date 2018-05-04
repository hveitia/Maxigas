import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {UserService} from "../../services/user-service";
import {UniqueDeviceID} from '@ionic-native/unique-device-id';
import {SplashScreen} from "@ionic-native/splash-screen";

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  name: String = '';
  phone: String = '';

  constructor(public nav: NavController, public userService: UserService,
              private uniqueDeviceID: UniqueDeviceID, public splashScreen: SplashScreen,
              public alertCtrl: AlertController ) {
  }

  ionViewDidLoad() {

    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        this.userService.uuid = uuid;
      })
      .catch((error: any) => console.log(error));

  }

  signup() {

    if(this.name =='' || this.phone == ''){
      let alert = this.alertCtrl.create({
        title: 'Estimado Usuario',
        subTitle: 'Por favor verifique que no hay campos vacíos.',
        buttons: ['OK']
      });
      alert.present();
    }else {
      const userToSave = {
        name: this.name,
        pass: this.userService.uuid,
        phone: this.phone,
        type: 'CLIENT',
        uuid: this.userService.uuid,
        pushId: this.userService.uuid
      };

      this.userService.register(userToSave).subscribe(data => this.login(),
        error => console.log(error)
      );
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
      uuid: this.userService.uuid
    };

    this.userService.login(uuid).subscribe(data => {
        if (data.success) {
          this.createUserLogued(data)
        }
      },
      error => console.log(error)
    );

    //this.nav.setRoot(LoginPage);
  }
}
