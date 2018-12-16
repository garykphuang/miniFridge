import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'page-addToShoppingList',
  templateUrl: 'addToShoppingList.html'
})

// Code for this page was adapted from an Ionic Themes Tutorial
// https://ionicthemes.com/tutorials/about/building-a-ionic-firebase-app-step-by-step
export class AddToShoppingList {

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
    this.shoppingAddingBuilder();
  }

  // This function builds the page to allow values to be entered.
  shoppingAddingBuilder(){
    this.simple_form = this.formBuilder.group({
      item: new FormControl('', Validators.required),
      quantity: new FormControl(''),
      unit: new FormControl(''),
      category: new FormControl('')
    });
  }

  // This onSubmit function works with an add button which when clicked takes the values
  // entered by the user into the input lines and creates a shoppingListItem, placing it
  // into firebase database. The function also produces a message telling the user
  // the item was created successfully.
  onSubmit(value){
    let data = {
      item: value.item,
      quantity: value.quantity,
      unit: value.unit,
      category: value.category
    }
    this.firebaseService.createShoppingListItems(data)
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
  // the shopping_list in firebase so new values can be entered.
  resetFields(){
    this.simple_form.reset()
  }

}
