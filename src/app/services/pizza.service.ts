import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiPaths } from '../enums/custom';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(ApiPaths.pizzaList);
  }

  getOneById(id: string): Observable<any> {
    return this.http.get(`${ApiPaths.pizzaList}/${id}`);
  }

  getAllIngredients(): Observable<any> {
    return this.http.get(ApiPaths.ingredientsList);
  }
}
