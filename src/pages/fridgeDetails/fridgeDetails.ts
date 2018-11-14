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

}
