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
          expiration: value.expiration,
          location: value.location
        })
        .then(
          res => resolve(res),
          err => reject(err)
        )
      })
    }

    createShoppingListItems(value){
      return new Promise<any>((resolve, reject) => {
        let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('ShoppingList').add({
          item: value.item,
          category: value.category
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

    unsubscribeOnLogOut(){
      //remember to unsubscribe from the snapshotChanges
      // debugger;
      this.snapshotChangesSubscription.unsubscribe();
    }

    // getFridgeItems(){
    //   return new Promise<any>((resolve, reject) => {
    //     this.snapshotChangesSubscription = this.afs.collection('fridgeItems').snapshotChanges()
    //     .subscribe(snapshots => {
    //       resolve(snapshots);
    //     })
    //   });
    // }

}
