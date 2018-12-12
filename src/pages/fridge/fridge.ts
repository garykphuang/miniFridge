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
   yesterday: any
   tomorrow: any
   filters: any
   filterRadioOpen: any
   filterRadioResult: any


	 ionViewWillEnter(){
		 this.getData();
	 }

// call color-coding function in here
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

  sortLocation(a, b) {
    if (a.location > b.Location) {
      return 1;
    } else if (b.location > a.location) {
      return -1;
    } else {
      return 0;
    }
  }

  sortItems(value) {
    if (value === 'name'){
      return this.sortName;
    } if (value === 'expiration'){
      return this.sortExpiration;
    } if (value === 'location'){
      return this.sortLocation;
    }
  }

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

  getFilter(){
    let filterTest = this.firebaseService.getFilter();
    console.log(filterTest);
    this.firebaseService.getFilter()
    .then(filter => {
      this.filters = filter;
      for (let filter of this.filters){
        filter.id = filter.payload.doc.id;
        filter.fridgeFilter = filter.payload.doc.data().fridgeFilter;
        filter.shoppingListFilter = filter.payload.doc.data().shoppingListFilter;
      }
    })
  }

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

	 viewDetails(id, item){
		 // debugger
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

	 goToShoppingList(){
		 this.navCtrl.push(ShoppingList)
	 }

	 goToAddPage(){
		 this.navCtrl.push(AddToFridge)
	 }

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~abigail~~~~~~~~~~~~
   colorCode(thing){
     let expD = thing.payload.doc.data().expiration;
     let exp = moment(expD).diff(moment(), 'days');
     // let exp = this.daysUntil;
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
