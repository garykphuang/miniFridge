import { Component } from '@angular/core';
import { ViewController, ToastController, NavParams} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'page-shoppingListDetails',
  templateUrl: 'shoppingListDetails.html'
})
export class ShoppingListDetails {

  // Instantiating variables that are used below
  validations_form: FormGroup;
  item: any;
  id: any;

  constructor(
    private navParams: NavParams,
    public formBuilder: FormBuilder,
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
    this.id = this.navParams.get('id')
    this.validations_form = this.formBuilder.group({
      item: new FormControl(this.item.item, Validators.required),
      quantity: new FormControl(this.item.quantity),
      unit: new FormControl(this.item.unit),
      category: new FormControl(this.item.category)
    });
  }

  // The dismiss function gets rid of the fridgeDetails page.
  dismiss() {
   this.viewCtrl.dismiss();
  }

  // This function takes in a value and creates a dictionary that stores
  // the data entered for an item. It then updates that data using the updateShoppingListItem()
  // function and the id and the data entered in firebase. It then creates a message
  // confirming the update of that item data and then dismisses the fridgeDetails page.
  onSubmit(value){
    let data = {
      item: value.item,
      quantity: value.quantity,
      unit: value.unit,
      category: value.category
    }
    this.firebaseService.updateShoppingListItem(this.id, data)
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

  // This function when prompted runs the deleteShoppingListItems() function that deletes
  // that item from firebase using its id and then produces a message telling the user
  // that the item was deleted successfully.
  delete() {
    this.firebaseService.deleteShoppingListItem(this.id)
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

  // This function if uses the moveToFridge() function and uses the id and
  // data of an item to move it to the shopping list in firebase. Then the function
  // dismisses the fshoppingListDetails page and creates a message confirming the move
  // from shopping list to frigde.
  move() {
    this.firebaseService.moveToFridge(this.id, this.item)
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
