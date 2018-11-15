import { Component } from '@angular/core';
import { ToastController, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: "page-reset-password",
  templateUrl: "reset-password.html"
})
export class ResetPasswordPage {
  validations_form: FormGroup;

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

  ionViewWillLoad(){
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

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
