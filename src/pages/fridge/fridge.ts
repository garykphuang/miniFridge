import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, ToastController } from 'ionic-angular';

import { FridgeDetails } from '../fridgeDetails/fridgeDetails';
import { AddToFridge } from '../addToFridge/addToFridge';
import { ShoppingList } from '../shopping_list/shopping_list';
import { LoginPage } from '../login/login';

import { FirebaseService } from '../../services/firebase.service';

export interface Config {
}

@Component({
  selector: 'page-fridge',
  templateUrl: 'fridge.html',
})

export class Fridge {

   constructor(public navCtrl 	: NavController,
		     			 public firebaseService: FirebaseService,
               private viewCtrl: ViewController,
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
		 })
	 }


	 viewDetails(id, item){
		 // debugger
		 let data = {
			 item: item.item,
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

}
