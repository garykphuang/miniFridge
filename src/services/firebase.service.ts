import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from 'angularfire2/firestore';


@Injectable()
export class FirebaseService {

  constructor(
    public afs: AngularFirestore,
  ){

  }

    addfridgeItems(value){
      return new Promise<any>((resolve, reject) => {
        this.afs.collection('/fridgeItems').add({
          item: value.item,
          expiration: value.expiration,
          location: value.location
        })
        .then(
          (res) => {
            resolve(res)
          },
          err => reject(err)
        )
      })
    }

}
