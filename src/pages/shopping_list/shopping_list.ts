import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from 'ionic-angular';

import { AddToShoppingList } from '../addToShoppingList/addToShoppingList';

export interface Config {
	shoppingList: string;
}

@Component({
  selector: 'page-shoppinglist',
  templateUrl: 'shopping_list.html'
})

export class ShoppingList {

   public rows : any;

   constructor(public navCtrl 	: NavController,
               private http   	: HttpClient) {
	 }

   ionViewDidLoad() : void {
      this.http
      .get<Config>('../../assets/data/shoppingList.json')
      .subscribe((data) =>
      {
         this.rows = data.shoppingList;
      });
   }

	 goToAddPage(){
		 this.navCtrl.push(AddToShoppingList)
	 }

}
