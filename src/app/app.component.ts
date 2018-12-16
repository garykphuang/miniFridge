import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { Fridge } from '../pages/fridge/fridge';

import { AuthService } from '../services/auth.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      if (this.authService.loggedIn()) {
        this.rootPage = Fridge;
      } else {
        this.rootPage = LoginPage;
      }
      splashScreen.hide();
    });
  }
// }

// initializeApp() {
//   this.platform.ready().then(() => {
//     this.statusBar.styleDefault();
//   });

//   this.auth.afAuth.authState
//     .subscribe(
//       user => {
//         if (user) {
//           this.rootPage = Fridge;
//         } // else {
//           // this.rootPage = login;
//         // }
//       },
//
//       () => {
//         this.rootPage = LoginPage;
//       }
//     );
// }
}
