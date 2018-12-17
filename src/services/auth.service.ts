import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import * as firebase from 'firebase/app';
import { FirebaseService } from './firebase.service';


// This service handles all functions related to authentication
//
// Code for this page was adapted from an Ionic Themes Tutorial
// https://ionicthemes.com/tutorials/about/building-a-ionic-firebase-app-step-by-step
@Injectable()
export class AuthService {

  constructor(
    private firebaseService: FirebaseService
  ){}

  // Creates a new user in Firebase using the email and password that was
  // inputted.
  doRegister(value){
   return new Promise<any>((resolve, reject) => {
     firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err))
   })
  }

  // Uses inputted email and password to login to Firebase.
  doLogin(value){
   return new Promise<any>((resolve, reject) => {
     firebase.auth().signInWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err))
   })
  }

  // Logs out of Firebase and unsubscribes user from the Firebase database.
  doLogout(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        firebase.auth().signOut()
        .then(() => {
          this.firebaseService.unsubscribeOnLogOut();
          resolve();
        }).catch((error) => {
          reject();
        });
      }
    })
  }

  // Sends a reset password link to the email inputted.
  resetPassword(value){
    return firebase.auth().sendPasswordResetEmail(value.email);
  }
}
