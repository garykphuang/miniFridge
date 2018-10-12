import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';

export interface Config {
	fridgeItems: string;
}


@Component({
  selector: 'page-fridge',
  templateUrl: 'fridge.html',
})

export class Fridge {

   /**
    * @name config
    * @type {any}
    * @public
    * @description     Defines an object allowing the interface properties to be accessed
    */
   public config : Config;

   /**
    * @name columns
    * @type {any}
    * @public
    * @description     Defines an object for storing the column definitions of the datatable
    */
   public columns : any;

   /**
    * @name rows
    * @type {any}
    * @public
    * @description     Defines an object for storing returned data to be displayed in the template
    */
   public rows : any;

   constructor(public navCtrl 	: NavController,
               private _HTTP   	: HttpClient)
   {
      // Define the columns for the data table
      // (based off the names of the keys in the JSON file)
      this.columns = [
        { prop: 'Item' },
        { name: 'Expiration' },
        { name: 'Location' }
      ];
   }

	 	goToAddPage(){
			this.navCtrl.push(HomePage)
		}

   /**
    * Retrieve the technologies.json file (supplying the data type, via
    * the config property of the interface object, to 'instruct' Angular
    * on the 'shape' of the object returned in the observable and how to
    * parse that)
    *
    * @public
    * @method ionViewDidLoad
    * @return {none}
    */
   ionViewDidLoad() : void
   {
      this._HTTP
      .get<Config>('../../assets/data/fridgeItems.json')
      .subscribe((data) =>
      {
         this.rows = data.fridgeItems;
      });

   }
}
