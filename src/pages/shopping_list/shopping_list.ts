import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, ToastController } from 'ionic-angular';

import { ShoppingListDetails } from '../shoppingListDetails/shoppingListDetails';
import { AddToShoppingList } from '../addToShoppingList/addToShoppingList';

import { FirebaseService } from '../../services/firebase.service';

export interface Config {
	shoppingList: string;
}

@Component({
  selector: 'page-shoppinglist',
  templateUrl: 'shopping_list.html'
})

export class ShoppingList {

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
		 this.firebaseService.getShoppingListItems()
		 .then(shoppingListItems => {
			 this.items = shoppingListItems;
		 })
	 }

	 viewDetails(id, item){
		 // debugger
		 let data = {
			 item: item.item,
			 category: item.category
		 }
		 this.navCtrl.push(ShoppingListDetails, {
			 data: data,
			 id: id
		 })
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
             this.firebaseService.deleteShoppingListItem(id)
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

	 move(id, data) {
			let confirm = this.alertCtrl.create({
				title: 'Confirm',
				message: 'Do you want to move this item to the fridge?',
				buttons: [
					{
						text: 'No',
						handler: () => {}
					},
					{
						text: 'Yes',
						handler: () => {
							this.firebaseService.moveToFridge(id, data)
							.then(
								res => {
									let toast = this.toastCtrl.create({
										message: 'Item was moved successfully',
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

	 goToAddPage(){
		 this.navCtrl.push(AddToShoppingList)
	 }


}
