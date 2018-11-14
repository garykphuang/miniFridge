import { Component } from '@angular/core';
import { ViewController, ToastController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'page-shoppingListDetails',
  templateUrl: 'shoppingListDetails.html'
})
export class ShoppingListDetails {

  validations_form: FormGroup;
  item: any;
  id: any;

  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    public formBuilder: FormBuilder,
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
    this.id = this.navParams.get('id')
    this.validations_form = this.formBuilder.group({
      item: new FormControl(this.item.item, Validators.required),
      category: new FormControl(this.item.category, Validators.required)
    });
  }

  dismiss() {
   this.viewCtrl.dismiss();
  }

  onSubmit(value){
    let data = {
      item: value.item,
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

  // delete() {
  //   let confirm = this.alertCtrl.create({
  //     title: 'Confirm',
  //     message: 'Do you want to delete ' + this.item.item + '?',
  //     buttons: [
  //       {
  //         text: 'No',
  //         handler: () => {}
  //       },
  //       {
  //         text: 'Yes',
  //         handler: () => {
  //           this.firebaseService.deleteFridgeItem(this.id)
  //           .then(
  //             res => this.viewCtrl.dismiss(),
  //             err => console.log(err)
  //           )
  //         }
  //       }
  //     ]
  //   });
  //   confirm.present();
  // }

}
