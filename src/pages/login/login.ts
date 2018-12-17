import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { RegisterPage } from '../register/register';
import { ResetPasswordPage } from '../reset-password/reset-password';
import { Fridge } from '../fridge/fridge';

import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

// This page is a form that allows users to enter their email and password to
// login.
//
// Code for this page was adapted from an Ionic Themes Tutorial
// https://ionicthemes.com/tutorials/about/building-a-ionic-firebase-app-step-by-step
export class LoginPage {

  validations_form: FormGroup;
  errorMessage: string = '';

  // Error messages that appear when fields are not filled in correctly
  validation_messages = {
   'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Please enter a valid email.' }
   ],
   'password': [
     { type: 'required', message: 'Password is required.' },
     { type: 'minlength', message: 'Password must be at least 5 characters long.' }
   ]
 };

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  // Builds login form when page loads. The form requires an email and password
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

  // Takes in an email and password value that it passes onto the doLogin
  // method in the authService module.
  tryLogin(value){
    this.authService.doLogin(value)
    .then(res => {
      this.navCtrl.setRoot(Fridge);
    }, err => {
      this.errorMessage = err.message;
    })
  }

  // Switches page to register page
  goRegisterPage(){
    this.navCtrl.push(RegisterPage);
  }

  // Switches page to reset password page
  goResetPasswordPage(){
    this.navCtrl.push(ResetPasswordPage);
  }


}
