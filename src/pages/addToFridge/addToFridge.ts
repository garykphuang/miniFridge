import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'page-addToFridge',
  templateUrl: 'addToFridge.html'
})
export class AddToFridge {

  // Instantiating variable simple_form we will use to create a form later with
  // formBuilder
  simple_form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public firebaseService: FirebaseService,
    public toastCtrl: ToastController
  ) {

  }

  // This function runs when the page has loaded in order to run the builder function
  // that creates the form to enter the values.
  ionViewWillLoad(){
    this.fridgeAddingBuilder();
  }

  // This function builds the page to allow values to be entered.
  fridgeAddingBuilder(){
    this.simple_form = this.formBuilder.group({
      item: new FormControl('', Validators.required),
      quantity: new FormControl(''),
      unit: new FormControl(''),
      expiration: new FormControl(''),
      location: new FormControl('')
    });
  }

  // This onSubmit function works with an add button which when clicked takes the values
  // entered by the user into the input lines and creates a fridgeItem, placing it
  // into firebase database. The function also produces a message telling the user
  // the item was created successfully.
  onSubmit(value){
    let data = {
      item: value.item,
      quantity: value.quantity,
      unit: value.unit,
      expiration: value.expiration,
      location: value.location
    }
    this.firebaseService.createFridgeItems(data)
    .then(
      res => {
        let toast = this.toastCtrl.create({
          message: 'Item was created successfully',
          duration: 3000
        });
      toast.present();
      this.resetFields();
    }, err => {
      console.log(err)
    })
  }

  // This function simply resets the data stored after the item was created into
  // fridge in firebase so new values can be entered.
  resetFields(){
    this.simple_form.reset()
  }

}
