import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';

import { Fridge } from '../fridge/fridge';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})

// This page handles registration of new users
//
// Code for this page was adapted from an Ionic Themes Tutorial
// https://ionicthemes.com/tutorials/about/building-a-ionic-firebase-app-step-by-step
export class RegisterPage {

  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  // Error messages that appear when fields are not filled in correctly
  validation_messages = {
   'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Enter a valid email.' }
   ],
   'password': [
     { type: 'required', message: 'Password is required.' },
     { type: 'minlength', message: 'Password must be at least 6 characters long.' }
   ]
 };

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder
  ) {}

  // Builds registration form when page loads. The form requires an email and password
  // with specific length and character restrictions.
  ionViewWillLoad(){
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  // Takes in an email and password value that it passes onto the doRegister
  // method in the authService module. Also logs user in automatically if
  // registration is successful and creates a default filter that sorts items
  // alphabetically by name.
  tryRegister(value){
    this.authService.doRegister(value)
     .then(res => {
       this.firebaseService.createFilter();
       console.log(res);
       let toast = this.toastCtrl.create({
         message: 'Your account has been created and you have been logged in',
         duration: 3000
       });
     toast.present();
     this.authService.doLogin(value)
     this.navCtrl.setRoot(Fridge);
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = "";
     })
  }

  // Switches page to login page
  goLoginPage(){
    this.navCtrl.pop();
  }

}
