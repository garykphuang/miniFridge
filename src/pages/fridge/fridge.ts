import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { ShoppingList } from '../shopping_list/shopping_list';

export interface Config {
	fridgeItems: string;
}

@Component({
  selector: 'page-fridge',
  templateUrl: 'fridge.html',
})

export class Fridge {

   public rows : any;

   constructor(public navCtrl 	: NavController,
               private http   	: HttpClient) {
   }

   ionViewDidLoad() : void {
      this.http
      .get<Config>('../../assets/data/fridgeItems.json')
      .subscribe((data) =>
      {
         this.rows = data.fridgeItems;
      });

   }

	 goToShoppingList(){
		 this.navCtrl.push(ShoppingList)
	 }

	 goToAddPage(){
		 this.navCtrl.push(HomePage)
	 }

}
