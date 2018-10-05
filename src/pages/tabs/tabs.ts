import { Component } from '@angular/core';

import { ShoppingList } from '../shopping_list/shopping_list';
import { HomePage } from '../home/home';
import { Fridge } from '../fridge/fridge';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = Fridge;
  tab3Root = ShoppingList;

  constructor() {

  }
}
