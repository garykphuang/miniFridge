import { Component } from '@angular/core';
import { ViewController, ToastController, NavParams} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'page-fridgeDetails',
  templateUrl: 'fridgeDetails.html'
})


export class FridgeDetails {

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

  ionViewWillLoad(){
    this.getData()
  }


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

  dismiss() {
   this.viewCtrl.dismiss();
  }

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
