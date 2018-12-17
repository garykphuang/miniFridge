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

export class ShoppingList {

	 constructor(public navCtrl 	: NavController,
		     			 public firebaseService: FirebaseService,
							 private alertCtrl: AlertController,
						 	 public toastCtrl: ToastController) {}

   // Instantiating variables that we will use below
	 items: any
	 filters: any
	 sortRadioOpen: any
	 sortRadioResult: any

	 // This function runs when the page has loaded in order to run the getData function
   // that will get the data from firebase and display it in the format set forth
   // by the getData() function and the .html file
	 ionViewWillEnter(){
		 this.getData();
	 }

	 // The getData() function accesses firebase and runs the getShoppingListItems() function.
   // in order to get the dat from firebase for items in the shopping list. It also runs
	 // the getFilter() function which gets the filter stored in firebase so when the
	 // fridgeItems load on the page, they are sorted by the previously set choice by the user.
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

  // This function takes in two items and sorts them alphabetically by their categories
	 sortCategory(a, b) {
		 if (a.category > b.category) {
			 return 1;
		 } else if (b.category > a.category) {
			 return -1;
		 } else {
			 return 0;
		 }
	 }

  // This function takes in two items and sorts them alphabetically by their names
	 sortName(a, b) {
		 if (a.name > b.name) {
			 return 1;
		 } else if (b.name > a.name) {
			 return -1;
		 } else {
			 return 0;
		 }
	 }

	 // This function takes in a value and according to that value, sets the filter
	 // to that of the chosen value.
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

	 // This function when prompted produces an alert which asks the user if they want to
	 // delete an item. If they click no, nothing happens. If they click yes, the deleteShoppingListItems()
	 // function deletes that item from firebase using its id and then produces a message telling the user
	 // that the item was deleted successfully.
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

	 // This function if prompted creates an alert that asks the user if they want
   // to move an item from the shopping list to the fridge. If they say yes, the
   // moveToFridge() function uses the id and data of that item to move it
   // to the shopping list in firebase. Then the function reloads the page so that
   // the page displays the correct data and creates a message confirming the move
   // from shopping list to fridge.
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

	 // This function works with a button. When prompted, it creates a list where the user can
   // choose two of the filter options and according to that chosen option, it first sorts the
   // items in the shopping list and then uses the updateShoppingListFilter() function to
	 // update the value of the filter in firebase.
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
