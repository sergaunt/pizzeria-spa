import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { RadioGroupButtonOption, AppState } from 'src/app/interfaces';
import { AddToCart } from '../../actions/cart.actions';
import { loadingStatusSelector } from 'src/app/selectors/pizzaListSelector';

@Component({
  selector: 'app-pizza-page',
  templateUrl: './pizza-page.component.html',
  styleUrls: ['./pizza-page.component.sass']
})
export class PizzaPageComponent implements OnInit {
  pizzaItem: any;
  diameterOptions: RadioGroupButtonOption[];
  thicknessOptions: RadioGroupButtonOption[];
  diameterSelected: number;
  thicknessSelected: string;
  withCheeseBoard: boolean;
  loading$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(loadingStatusSelector));
    this.pizzaItem = this.route.snapshot.data.pizzaItem;
    const { diameter, thickness } = this.pizzaItem.size;
    this.diameterOptions = diameter.map(diameterItem => ({
      title: diameterItem.value.toString(),
      value: diameterItem.value.toString()
    }));
    this.thicknessOptions = thickness.map(thicknessItem => ({
      title: thicknessItem.type,
      value: thicknessItem.type
    }));
    this.thicknessSelected = this.thicknessOptions[0].value.toString();
    this.diameterSelected = +this.diameterOptions[0].value.toString();
  }

  changeDiameter(value: string) {
    if (this.diameterSelected === +value) {
      return;
    }
    this.diameterSelected = +value;
    if (!this.displayCheeseBoard) {
      this.withCheeseBoard = false;
    }
  }

  changeThickness(value: string) {
    if (this.thicknessSelected === value) {
      return;
    }
    this.thicknessSelected = value;
  }

  toggleCheeseBoard() {
    this.withCheeseBoard = !this.withCheeseBoard;
  }

  addToCart() {
    const pizzaItem = {
      pizzaID: this.pizzaItem.id,
      amount: 1,
      excludedIngredients: [],
      customIngredients: [],
      cheeseBoard: this.withCheeseBoard,
      thickness: this.thicknessSelected,
      diameter: this.diameterSelected,
      price: parseFloat(this.pizzaPrice),
      pizzaDetails: this.pizzaItem
    };
    this.store.dispatch(new AddToCart(pizzaItem));
  }

  get displayCheeseBoard() {
    return this.diameterSelected && this.diameterSelected >= 30;
  }

  get pizzaPrice() {
    let recalculatedPrice = this.pizzaItem.price;
    if (this.withCheeseBoard) {
      recalculatedPrice *= 1.15;
    }
    const { diameter, thickness } = this.pizzaItem.size;
    const { priceRate: thicknessPriceRate } = thickness.find(
      item => this.thicknessSelected === item.type
    );
    const { priceRate: diameterPriceRate } = diameter.find(
      item => this.diameterSelected === item.value
    );
    recalculatedPrice *= thicknessPriceRate * diameterPriceRate;
    return recalculatedPrice.toFixed(1);
  }
}
