import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import * as firebase from 'firebase/app';
import { FirebaseService } from './firebase.service';

@Injectable()
export class AuthService {

  constructor(
    private firebaseService: FirebaseService
  ){}

  doRegister(value){
   return new Promise<any>((resolve, reject) => {
     firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err))
   })
  }

  doLogin(value){
   return new Promise<any>((resolve, reject) => {
     // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL) {
     //   .then(function() {
     //     return firebase.auth().signInWithEmailAndPassword(value.email, value.password);
     //   })
     //   .catch(function(error) {
     //     var errorCode = error.code;
     //     var errorMessage = error.message;
     //   })
     // }
     firebase.auth().signInWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err))
   })
  }

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

  loggedIn() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        return true
      } else {
        return false
      }
    });
  }

  resetPassword(value){
    return firebase.auth().sendPasswordResetEmail(value.email);
  }
}
