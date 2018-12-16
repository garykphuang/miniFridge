import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';



@Injectable()
export class FirebaseService {

  private snapshotChangesSubscription: any;
  constructor(
    public afs: AngularFirestore,
  ){

  }

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

    getFridgeItems(){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
      this.snapshotChangesSubscription = this.afs.collection('people').doc(currentUser.uid).collection('fridgeItems').snapshotChanges()
        .subscribe(snapshots => {
          resolve(snapshots);
        })
      });
    }

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

    getShoppingListItems(){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
      this.snapshotChangesSubscription = this.afs.collection('people').doc(currentUser.uid).collection('shoppingListItems').snapshotChanges()
        .subscribe(snapshots => {
          resolve(snapshots);
        })
      });
    }

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

    getFilter(){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
      this.snapshotChangesSubscription = this.afs.collection('people').doc(currentUser.uid).collection('filter').snapshotChanges()
        .subscribe(snapshots => {
          resolve(snapshots);
        })
      });
    }

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

    unsubscribeOnLogOut(){
      //remember to unsubscribe from the snapshotChanges
      // debugger;
      this.snapshotChangesSubscription.unsubscribe();
    }

}
