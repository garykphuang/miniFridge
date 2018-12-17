import { Component } from '@angular/core';
import { ToastController, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: "page-reset-password",
  templateUrl: "reset-password.html"
})

// This page handles password resetting of users.
//
// Code for this page was adapted from a tutorial by Jave Bratt
// https://javebratt.com/ionic-firebase-tutorial-auth/
export class ResetPasswordPage {
  validations_form: FormGroup;

  // Error messages that appear when fields are not filled in correctly
  validation_messages = {
   'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Enter a valid email.' }
   ]
 };


  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController,
    private viewCtrl: ViewController,
    private formBuilder: FormBuilder
  ) {}

  // Builds reset password form when page loads. The form requires an valid
  // email.
  ionViewWillLoad(){
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

  // Takes in an email and password value that it passes onto the resetPassword
  // method in the authService module.
  resetPassword(value){
    this.authService.resetPassword(value)
    .then(
      res => {
        let toast = this.toastCtrl.create({
          message: 'Check your email for a password reset link',
          duration: 3000
        });
      toast.present();
      this.viewCtrl.dismiss();
    }, err => {
      console.log(err)
    })
  }
}
