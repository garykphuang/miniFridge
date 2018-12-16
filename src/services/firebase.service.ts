import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';


// This service handles all functions related to the Firebase database, where
// all information for fridge items and shopping list items is stored.
//
// Code for this page was adapted from an Ionic Themes Tutorial and a Jave Jave
// Bratt tutorial.
// https://ionicthemes.com/tutorials/about/building-a-ionic-firebase-app-step-by-step
// https://javebratt.com/ionic-firebase-tutorial-auth/
@Injectable()
export class FirebaseService {

  private snapshotChangesSubscription: any;
  constructor(
    public afs: AngularFirestore,
  ){

  }

    // Takes the inputted data from the add to fridge page and creates a new
    // document in the fridgeItems collection.
    createFridgeItems(value){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('fridgeItems').add({
          item: value.item,
          quantity: value.quantity,
          unit: value.unit,
          expiration: value.expiration,
          location: value.location
        })
        .then(
          res => resolve(res),
          err => reject(err)
        )
      })
    }

    // Gets the collection of fridge items from Firebase for the currently
    // logged in user
    getFridgeItems(){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
      this.snapshotChangesSubscription = this.afs.collection('people').doc(currentUser.uid).collection('fridgeItems').snapshotChanges()
        .subscribe(snapshots => {
          resolve(snapshots);
        })
      });
    }

    // Takes an item ID and the inputted data from the fridge details page to
    // update the respective document in the Firebase database.
    updateFridgeItem(itemKey, value){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
        this.afs.collection('people').doc(currentUser.uid).collection('fridgeItems').doc(itemKey).set(value)
        .then(
          res => resolve(res),
          err => reject(err)
        )
      })
    }

    // Takes an item ID and deletes that item from the Firebase database.
    deleteFridgeItem(itemKey){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
        this.afs.collection('people').doc(currentUser.uid).collection('fridgeItems').doc(itemKey).delete()
        .then(
          res => resolve(res),
          err => reject(err)
        )
      })
    }

    // Takes the inputted data from the add to fridge page and creates a new
    // document in the shopping list items collection.
    createShoppingListItems(value){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('shoppingListItems').add({
          item: value.item,
          quantity: value.quantity,
          unit: value.unit,
          category: value.category
        })
        .then(
          res => resolve(res),
          err => reject(err)
        )
      })
    }

    // Gets the collection of shopping list items from Firebase for the currently
    // logged in user
    getShoppingListItems(){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
      this.snapshotChangesSubscription = this.afs.collection('people').doc(currentUser.uid).collection('shoppingListItems').snapshotChanges()
        .subscribe(snapshots => {
          resolve(snapshots);
        })
      });
    }

    // Takes an item ID and the inputted data from the shopping list item
    // details page to update the respective document in the Firebase database.
    updateShoppingListItem(itemKey, value){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
        this.afs.collection('people').doc(currentUser.uid).collection('shoppingListItems').doc(itemKey).set(value)
        .then(
          res => resolve(res),
          err => reject(err)
        )
      })
    }

    // Takes an item ID and deletes that item from the Firebase database.
    deleteShoppingListItem(itemKey){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
        this.afs.collection('people').doc(currentUser.uid).collection('shoppingListItems').doc(itemKey).delete()
        .then(
          res => resolve(res),
          err => reject(err)
        )
      })
    }

    // Takes an item ID of an item in the shopping list and moves the item and
    // its data to the fridge items list. It also deletes the item from the
    // shopping list
    moveToFridge(itemKey, value){
      this.deleteShoppingListItem(itemKey);
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('fridgeItems').add({
          item: value.item,
          quantity: value.quantity,
          unit: value.unit,
          category: value.category
        })
        .then(
          res => resolve(res),
          err => reject(err)
        )
      })
    }

    // Takes an item ID of an item in the fridge list and moves the item and
    // its data to the shopping list list. It also deletes the item from the
    // fridge.
    moveToShoppingList(itemKey, value){
      this.deleteFridgeItem(itemKey);
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('shoppingListItems').add({
          item: value.item,
          quantity: value.quantity,
          unit: value.unit
        })
        .then(
          res => resolve(res),
          err => reject(err)
        )
      })
    }

    // Creates the filter document in Firebase and gives it an initial value
    // of name.
    createFilter(){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('filter').add({
          fridgeFilter: "name",
          shoppingListFilter: "name"
        })
        .then(
          res => resolve(res),
          err => reject(err)
        )
      })
    }

    // Gets the filter document from Firebase.
    getFilter(){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
      this.snapshotChangesSubscription = this.afs.collection('people').doc(currentUser.uid).collection('filter').snapshotChanges()
        .subscribe(snapshots => {
          resolve(snapshots);
        })
      });
    }

    // Takes the item ID of the currently used filter document and updates it
    // with the new filter value.
    updateFilter(itemKey, value){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
        this.afs.collection('people').doc(currentUser.uid).collection('filter').doc(itemKey).set(value)
        .then(
          res => resolve(res),
          err => reject(err)
        )
      })
    }

    // Unsubscribes user from the database.
    unsubscribeOnLogOut(){
      this.snapshotChangesSubscription.unsubscribe();
    }

}
