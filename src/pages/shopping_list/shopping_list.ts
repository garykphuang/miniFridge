import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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
		     			 public firebaseService: FirebaseService) {}

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
			 data: data
		 })
	 }

	 goToAddPage(){
		 this.navCtrl.push(AddToShoppingList)
	 }

}
