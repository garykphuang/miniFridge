import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';

import { FridgeDetails } from '../fridgeDetails/fridgeDetails';
import { AddToFridge } from '../addToFridge/addToFridge';
import { ShoppingList } from '../shopping_list/shopping_list';
import { LoginPage } from '../login/login';

import * as firebase from 'firebase/app';

import { FirebaseService } from '../../services/firebase.service';

import moment from 'moment';

export interface Config {
}

@Component({
  selector: 'page-fridge',
  templateUrl: 'fridge.html',
})

// This page displays the list of items in the fridge and their associated
// details.
//
// Code for this page was adapted from an Ionic Themes Tutorial
// https://ionicthemes.com/tutorials/about/building-a-ionic-firebase-app-step-by-step
export class Fridge {

   constructor(public navCtrl 	: NavController,
		     			 public firebaseService: FirebaseService,
               private alertCtrl: AlertController,
               public toastCtrl: ToastController) {}

   // Instantiating variables that we will use below
   items: any
   yesterday: any
   tomorrow: any
   filters: any
   filterRadioOpen: any
   filterRadioResult: any

   // This function runs when the page has loaded in order to run the getData function
   // that will get the data from firebase and display it in the format set forth
   // by the getData() function and the .html file
	 ionViewWillEnter(){
		 this.getData();
     console.log(firebase.auth().currentUser)
	 }

   // The getData() function accesses firebase and runs the getFridgeItems() function.
   // It calculates the days until expiration and according to that expiration date,
   // runs the colorCode() function to assign a color for the expiration date of that item
   // that is used in the .html file. It also gets the runs the getFilter() function which
   // gets the filter stored in firebase so when the fridgeItems load on the page, they
   // are sorted by the previously set choice by the user.
	 getData(){
		 this.firebaseService.getFridgeItems()
		 .then(fridgeItems => {
			 this.items = fridgeItems;
       this.yesterday = moment(moment()).subtract(1, 'days');
       this.tomorrow = moment(moment()).add(1, 'days');
       for (let item of this.items){
         item.name = item.payload.doc.data().item;
         item.expiration = item.payload.doc.data().expiration;
         item.location = item.payload.doc.data().location;
         item.daysUntil = this.checkExpiration(item.expiration);
         item.color = this.colorCode(item);
       }
       this.firebaseService.getFilter()
       .then(filter => {
         this.filters = filter;
         for (let filter of this.filters){
           filter.id = filter.payload.doc.id
           filter.fridgeFilter = filter.payload.doc.data().fridgeFilter;
         }
         let fridgeFilter = this.filters[0].fridgeFilter;
         this.items.sort(this.sortItems(fridgeFilter));
       })
		 })
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

  // This function takes in two items and orders them according to their expiration dates
  sortExpiration(a, b) {
    if (a.expiration > b.expiration) {
      return 1;
    } else if (b.expiration > a.expiration) {
      return -1;
    } else {
      return 0;
    }
  }

  // This function takes in two items and sorts them alphabetically by their location
  sortLocation(a, b) {
    if (a.location > b.Location) {
      return 1;
    } else if (b.location > a.location) {
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
    } if (value === 'expiration'){
      return this.sortExpiration;
    } if (value === 'location'){
      return this.sortLocation;
    }
  }

  // This function works with a button. When prompted, it creates a list where the user can
  // choose three of the filter options and according to that chosen option, it first sorts the
  // items in the fridge and then uses the updateFridgeFilter() function to update the value
  // of the filter in firebase.
  fridgeFilter(){
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
          label: 'Expiration',
          value: 'expiration'
        },
        {
          type: 'radio',
          label: 'Location',
          value: 'location'
        }
      ],

      buttons: [
        {
          text: 'Confirm',
          role: 'Cancel',
          handler: data => {
            this.filterRadioOpen = false;
            this.filterRadioResult = this.items.sort(this.sortItems(data));
            this.updateFridgeFilter(data);
          }
        }
      ]
    });
    alert.present()
  }

   // Updates the value of the filter in firebase
   updateFridgeFilter(newFilter){
     this.firebaseService.getFilter()
     .then(filter => {
       this.filters = filter;
       for (let filter of this.filters){
         filter.id = filter.payload.doc.id;
         filter.shoppingListFilter = filter.payload.doc.data().shoppingListFilter;
       }
       let data = {
         fridgeFilter: newFilter,
         shoppingListFilter: this.filters[0].shoppingListFilter
       }
       this.firebaseService.updateFilter(this.filters[0].id, data)
     })
   }

   // Uses Moment.js to check the expiration date of each item in the list.
   // Sets the daysUntilExpiration variable to be a string that reflects how
   // soon the item is expiring. This string is displayed in the fridge list.
   checkExpiration(expirationDate){
     let daysUntilExpiration = "";
     if (moment(expirationDate).isAfter(moment(), 'day')){
       let plusOneExpirationDate = moment(expirationDate).add(1, 'days');
       daysUntilExpiration = "Expiring in " + moment(plusOneExpirationDate).diff(moment(), 'days') + " days";
     } if (moment(expirationDate).isBefore(moment(), 'day')) {
       daysUntilExpiration = "Expired " + moment().diff(expirationDate, 'days') + " days ago";
     } if (moment(expirationDate).isSame(this.yesterday, 'day')) {
       daysUntilExpiration = "Expired yesterday";
     } if (moment(expirationDate).isSame(this.tomorrow, 'day')) {
       daysUntilExpiration = "Expiring tomorrow";
     } if (moment(expirationDate).isSame(moment(), 'day')) {
       daysUntilExpiration = "Expiring today";
     } if (expirationDate == null) {
       daysUntilExpiration = "";
     }
     return daysUntilExpiration;
   }

   // Switches the page to the item's detail page. viewDetails also passes
   // the data of the item to the detail page so that the item information can
   // be displayed and edited accordingly.
	 viewDetails(id, item){
		 let data = {
			 item: item.item,
       quantity: item.quantity,
       unit: item.unit,
			 expiration: item.expiration,
			 location: item.location
		 }
		 this.navCtrl.push(FridgeDetails, {
			 data: data,
       id: id
		 })
	 }

   // This function if prompted pushes the Shopping List page to the navigation stack
   // and displays that page.
	 goToShoppingList(){
		 this.navCtrl.push(ShoppingList)
	 }

   // This function if prompted pushes the Add page to the navigation stack
   // and displays that page.
	 goToAddPage(){
		 this.navCtrl.push(AddToFridge)
	 }

   // The function takes an item as a parameter. Then it stores the expiration date
   // of that item in a variable. It then makes a new variable exp that stores the difference
   // between that day's date and the date stored. Then according to predetermined limits,
   // the function returns values(these are names of colors in our app) in order to color code
   // items according to the time left until their expiration.
   colorCode(item){
     let expD = item.payload.doc.data().expiration;
     let exp = moment(expD).diff(moment(), 'days');
     if (exp >= 4) {
       return "good";
     } else if (exp < 4 && exp >= 0) {
       return "expiring";
     } else if (exp < 0){
       return "bad";
     } else {
       return "none";
     }

   }

 // This function when prompted produces an alert which asks the user if they want to
 // delete an item. If they click no, nothing happens. If they click yes, the deleteFridgeItems()
 // function deleted that item from firebase using its id and then produces a message telling the user
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

   // This function when prompted produces an alert that asks the user if they want to log out.
   // If they say no, nothing happens. If they say yes, the function sets the root of the
   // navigation stack to the Login Page.
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

  // This function if prompted creates an alert that asks the user if they want
  // to move an item from the firdge to the shopping list. If they say yes, the
  // moveToShoppingList() function uses the id and data of that item to move it
  // to the shopping list in firebase. Then the function reloads the page so that
  // the page displays the correct data and creates a message confirming the move
  // from fridge to shopping list.
  move(id, data) {
    let confirm = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want to move this item to the shopping list?',
      buttons: [
        {
          text: 'No',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.firebaseService.moveToShoppingList(id, data)
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


}
