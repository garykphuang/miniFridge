import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ShoppingList } from '../pages/shopping_list/shopping_list';
import { HomePage } from '../pages/home/home';
import { Fridge } from '../pages/fridge/fridge';
import { TabsPage } from '../pages/tabs/tabs';
import { AddPage2Page } from '../pages/add-page2/add-page2';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { FirebaseService } from '../services/firebase.service';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environment/environment';

@NgModule({
  declarations: [
    MyApp,
    ShoppingList,
    HomePage,
    Fridge,
    TabsPage,
    AddPage2Page
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxDatatableModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ShoppingList,
    HomePage,
    Fridge,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FirebaseService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
