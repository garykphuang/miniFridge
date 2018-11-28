import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';

import { FridgeDetails } from '../fridgeDetails/fridgeDetails';
import { AddToFridge } from '../addToFridge/addToFridge';
import { ShoppingList } from '../shopping_list/shopping_list';
import { LoginPage } from '../login/login';

import { FirebaseService } from '../../services/firebase.service';

import moment from 'moment';

export interface Config {
}

@Component({
  selector: 'page-fridge',
  templateUrl: 'fridge.html',
})

export class Fridge {

   constructor(public navCtrl 	: NavController,
		     			 public firebaseService: FirebaseService,
               private alertCtrl: AlertController,
               public toastCtrl: ToastController) {}

   items: any

	 ionViewWillEnter(){
		 this.getData();
	 }

	 getData(){
		 this.firebaseService.getFridgeItems()
		 .then(fridgeItems => {
			 this.items = fridgeItems;
       for (let item of this.items){
         item.daysUntil = this.checkExpiration(item.payload.doc.data().expiration);
         item.name = item.payload.doc.data().item;
         item.expiration = item.payload.doc.data().expiration;
       }
       this.items.sort(this.sortExpiration);
		 })
	 }

  sortName(a, b) {
    if (a.name > b.name) {
      return 1;
    } else if (b.name > a.name) {
      return -1;
    } else {
      return 0;
    }
  }

  sortExpiration(a, b) {
    if (a.expiration > b.expiration) {
      return 1;
    } else if (b.expiration > a.expiration) {
      return -1;
    } else {
      return 0;
    }
  }

   checkExpiration(expirationDate){
     let daysUntilExpiration = "";
     if (moment(expirationDate).isAfter()){
       daysUntilExpiration = "Expiring in " + moment(expirationDate).diff(moment(), 'days') + " days";
     } if (moment(expirationDate).isBefore()) {
       daysUntilExpiration = "Expired by " + moment().diff(expirationDate, 'days') + " days";
     } if (moment(expirationDate).isSame()) {
       daysUntilExpiration = "Expiring today";
     }
     return daysUntilExpiration;
   }

	 viewDetails(id, item){
		 // debugger
		 let data = {
			 item: item.item,
       quantity: item.quantity,
			 expiration: item.expiration,
			 location: item.location
		 }
		 this.navCtrl.push(FridgeDetails, {
			 data: data,
       id: id
		 })
	 }

	 goToShoppingList(){
		 this.navCtrl.push(ShoppingList)
	 }

	 goToAddPage(){
		 this.navCtrl.push(AddToFridge)
	 }

   delete(id) {
     let confirm = this.alertCtrl.create({
       title: 'Confirm',
       message: 'Do you want to delete this item?',
       buttons: [
         {
           text: 'No',
           handler: () => {}
         },
         {
           text: 'Yes',
           handler: () => {
             this.firebaseService.deleteFridgeItem(id)
             .then(
               res => {
                 let toast = this.toastCtrl.create({
                   message: 'Item was deleted successfully',
                   duration: 3000
                 });
                 this.ionViewWillEnter();
                 toast.present();
               },
               err => console.log(err)
             )
           }
         }
       ]
     });
     confirm.present();
   }

   logOut() {
     let alert = this.alertCtrl.create({
       title: 'Log Out?',
       message: 'Are you sure you want to log out?',
       buttons: [
         {
           text: 'Cancel',
           role: 'cancel',
           handler: () => {
             console.log('Cancel clicked');
           }
         },
         {
           text: 'Log Out',
           handler: () => {
             this.navCtrl.setRoot(LoginPage);
           }
         }
       ]
     });
  alert.present();
}

  reOrderItems(indexes){
    let element = this.items[indexes.from];
    this.items.splice(indexes.from, 1);
    this.items.splice(indexes.to, 0, element);
}

}
