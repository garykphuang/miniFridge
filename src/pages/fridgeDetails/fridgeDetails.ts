import { Component } from '@angular/core';
import { ViewController, ToastController, NavParams} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'page-fridgeDetails',
  templateUrl: 'fridgeDetails.html'
})

// This page displays the details of individual items in the fridge.
//
// Code for this page was adapted from an Ionic Themes Tutorial
// https://ionicthemes.com/tutorials/about/building-a-ionic-firebase-app-step-by-step
export class FridgeDetails {

  // Instantiating variables that are used below
  validations_form: FormGroup;
  item: any;
  id: any;

  constructor(
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private firebaseService: FirebaseService
  ) {
  }

  // This function runs when the page has loaded in order to run the getData function
  // that will get the data from firebase and display it in the format set forth
  // by the formBuilder.
  ionViewWillLoad(){
    this.getData()
  }

  // The function gets the data and the id of an item and displays that information
  // according to the template set forth by the validation_form FormBuilder.
  getData(){
    this.item = this.navParams.get('data');
    this.id = this.navParams.get('id');
    this.validations_form = this.formBuilder.group({
      item: new FormControl(this.item.item, Validators.required),
      quantity: new FormControl(this.item.quantity),
      unit: new FormControl(this.item.unit),
      expiration: new FormControl(this.item.expiration),
      location: new FormControl(this.item.location)
    });
  }

  // The dismiss function gets rid of the fridgeDetails page.
  dismiss() {
   this.viewCtrl.dismiss();
  }

  // This function takes in a value and creates a dictionary that stores
  // the data entered for an item. It then updates that data using the updateFridgeItem()
  // function and the id and the data eneted in firebase. It then creates a message
  // confirming the update of that item data and then dismisses the fridgeDetails page.
  onSubmit(value){
    let data = {
      item: value.item,
      quantity: value.quantity,
      unit: value.unit,
      expiration: value.expiration,
      location: value.location
    }
    this.firebaseService.updateFridgeItem(this.id, data)
    .then(
      res => {
        let toast = this.toastCtrl.create({
          message: 'Item was updated successfully',
          duration: 3000
        });
      toast.present();
      this.viewCtrl.dismiss();
    }, err => {
      console.log(err)
    })
  }

  // This function when prompted runs the deleteFridgeItems() function that deletes
  // that item from firebase using its id and then produces a message telling the user
  // that the item was deleted successfully.
  delete() {
    this.firebaseService.deleteFridgeItem(this.id)
      .then(
      res => {
        let toast = this.toastCtrl.create({
          message: 'Item was deleted successfully',
          duration: 3000
        });
        toast.present();
        this.viewCtrl.dismiss()
      },
      err => console.log(err)
    )
  }

  // This function if uses the moveToShoppingList() function and uses the id and
  // data of an item to move it to the shopping list in firebase. Then the function
  // dismisses the fridgeDetails page and creates a message confirming the move
  // from fridge to shopping list.
  move() {
    this.firebaseService.moveToShoppingList(this.id, this.item)
      .then(
      res => {
        let toast = this.toastCtrl.create({
          message: 'Item was moved successfully',
          duration: 3000
        });
        this.viewCtrl.dismiss()
        toast.present();
      },
      err => console.log(err)
    )
  }

}
