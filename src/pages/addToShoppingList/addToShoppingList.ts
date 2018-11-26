import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'page-addToShoppingList',
  templateUrl: 'addToShoppingList.html'
})
export class AddToShoppingList {

  simple_form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public firebaseService: FirebaseService,
    public toastCtrl: ToastController
  ) {

  }

  ionViewWillLoad(){
    this.getData();
  }

  getData(){
    this.simple_form = this.formBuilder.group({
      item: new FormControl('', Validators.required),
      quantity: new FormControl(''),
      category: new FormControl('')
    });
  }

  onSubmit(value){
    let data = {
      item: value.item,
      quantity: value.quantity,
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

  resetFields(){
    this.simple_form.reset()
  }

}
