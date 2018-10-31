import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { DetailsPage } from '../details/details';
import { ShoppingList } from '../shopping_list/shopping_list';

import { FirebaseService } from '../../services/firebase.service';

export interface Config {
}

@Component({
  selector: 'page-fridge',
  templateUrl: 'fridge.html',
})

export class Fridge {

   constructor(public navCtrl 	: NavController,
		     			 public firebaseService: FirebaseService) {}

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
		 this.navCtrl.push(DetailsPage, {
			 data: data
		 })
	 }

	 goToShoppingList(){
		 this.navCtrl.push(ShoppingList)
	 }

	 goToAddPage(){
		 this.navCtrl.push(HomePage)
	 }

}
