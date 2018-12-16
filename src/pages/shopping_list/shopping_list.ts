import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';

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

// This page displays the list of items in the shopping list and their associated
// details.
//
// Code for this page was adapted from an Ionic Themes Tutorial
// https://ionicthemes.com/tutorials/about/building-a-ionic-firebase-app-step-by-step
export class ShoppingList {

	 constructor(public navCtrl 	: NavController,
		     			 public firebaseService: FirebaseService,
							 private alertCtrl: AlertController,
						 	 public toastCtrl: ToastController) {}

	 items: any
	 filters: any
	 sortRadioOpen: any
	 sortRadioResult: any

	 ionViewWillEnter(){
		 this.getData();
	 }

	 getData(){
		 this.firebaseService.getShoppingListItems()
		 .then(shoppingListItems => {
			 this.items = shoppingListItems;
			 for (let item of this.items){
				 item.name = item.payload.doc.data().item;
				 item.category = item.payload.doc.data().category;
			 }
			 this.firebaseService.getFilter()
			 .then(filter => {
				 this.filters = filter;
				 for (let filter of this.filters){
					 filter.id = filter.payload.doc.id
					 filter.shoppingListFilter = filter.payload.doc.data().shoppingListFilter
				 }
				 let shoppingListFilter = this.filters[0].shoppingListFilter;
				 this.items.sort(this.sortItems(shoppingListFilter));
			 })
		 })
	 }

	 sortCategory(a, b) {
		 if (a.category > b.category) {
			 return 1;
		 } else if (b.category > a.category) {
			 return -1;
		 } else {
			 return 0;
		 }
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

	 sortItems(value) {
		 if (value === 'name'){
			 return this.sortName;
		 } if (value === 'category'){
			 return this.sortCategory;
		 }
	 }

	 viewDetails(id, item){
		 // debugger
		 let data = {
			 item: item.item,
			 quantity: item.quantity,
			 unit: item.unit,
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

	 shoppingListFilter(){
     let alert = this.alertCtrl.create({
       title: 'Sort By',

       inputs: [
         {
           type: 'radio',
           label: 'Name',
           value: 'name',
           checked: true
         },
         {
           type: 'radio',
           label: 'Category',
           value: 'category'
         }
       ],

       buttons: [
         {
           text: 'Confirm',
           role: 'Cancel',
           handler: data => {
             this.sortRadioOpen = false;
             this.sortRadioResult = this.items.sort(this.sortItems(data));
						 this.updateShoppingListFilter(data);
           }
         }
       ]
     });
     alert.present()
   }

	 updateShoppingListFilter(newFilter){
     this.firebaseService.getFilter()
     .then(filter => {
       this.filters = filter;
       for (let filter of this.filters){
         filter.id = filter.payload.doc.id;
         filter.fridgeFilter = filter.payload.doc.data().fridgeFilter;
       }
       let data = {
         fridgeFilter: this.filters[0].fridgeFilter,
         shoppingListFilter: newFilter
       }
       this.firebaseService.updateFilter(this.filters[0].id, data)
     })
   }


}
