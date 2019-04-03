import { Injectable } from '@angular/core';
import { Restaurant } from './restaurant';
import { Rating } from './rating';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOption = {
  headers: new HttpHeaders({ 'content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  selectedRestaurant: Restaurant;
  map: google.maps.Map;
  service: google.maps.places.PlacesService;
  newRestaurant: google.maps.Marker;

  constructor( private http: HttpClient ) { }

  private restaurantsUrl = 'api/restaurants';

  getRestaurants() : Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.restaurantsUrl)
      .pipe(
        catchError(this.handleError<Restaurant[]>('getRestaurants', []))
      );
  }

  

  setRatingAverage(ratings: Rating[]): number {
    let ratingSum: number = 0;
    let ratingNumber: number = 0;

    for ( let rating of ratings ) {
      ratingSum = ratingSum + rating.stars;
      ratingNumber++;
    }

    

    const ratingAverage: number = Math.round(ratingSum / ratingNumber);
    return ratingAverage;
  }

  setStars(ratings: Rating[], rating: number): string {

    let averageRating: number = 0;

    if (ratings !== undefined) {
      averageRating = this.setRatingAverage(ratings);
    } else {
      averageRating = Math.round(rating);
    }


    let ratingStars: string = '';
    for( let i = 0; i < averageRating; i++) {
      ratingStars += '★';
    }

    for (let i = 0; i < 5 - averageRating; i++) {
      ratingStars += '☆';
    }

    return ratingStars;
  }

  setSelectedRestaurant(restaurant: Restaurant): void {
    this.selectedRestaurant = restaurant;
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    }
  }
}
