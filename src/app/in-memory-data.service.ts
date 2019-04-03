import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Restaurant } from './restaurant';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const restaurants: Restaurant[] = [
      {
        label: 'A',
        restaurantName: 'Bronco',
        address: '39 Rue des Petites écuries, 75010 Paris',
        placeId: '',
        lat: 48.8737815,
        long: 2.3501649,
        photo: `https://maps.googleapis.com/maps/api/streetview?size=1200x300&location=48.8737815,2.3501649&key=AIzaSyBVEp-IBuwZ89IFU305U388ctFMNlJaou8`,
        rating: 0,
        ratings: [
          {
            name: 'Inconnu',
            date: 1541883815,
            relativeTimeDescription: '',
            stars: 4,
            comment: "Un excellent restaurant, j'y reviendrai ! Par contre il vaut mieux aimer la viande."
          },
          {
            name: 'Inconnu',
            date: 1541883815,
            relativeTimeDescription: '',
            stars: 5,
            comment: "Tout simplement mon restaurant préféré !"
          }
        ]
      },
      {
        label: 'B',
        restaurantName: 'Babalou',
        address: '4 Rue Lamarck, 75018 Paris',
        placeId: '',
        lat: 48.8865035,
        long: 2.3442197,
        photo: `https://maps.googleapis.com/maps/api/streetview?size=1200x300&location=48.8865035,2.3442197&key=AIzaSyBVEp-IBuwZ89IFU305U388ctFMNlJaou8`,
        rating: 0,
        ratings: [
          {
            name: 'Inconnu',
            date: 1541883815,
            relativeTimeDescription: '',
            stars: 0,
            comment: "Une minuscule pizzeria delicieuse cachée juste à côté du Sacré choeur !"
          },
          {
            name: 'Inconnu',
            date: 1541883815,
            relativeTimeDescription: '',
            stars: 3,
            comment: "J'ai trouvé ça correct, mais ça casse pas trois pattes à un cochon"
          }
        ]
      }
    ];
    return {restaurants}
  }

  constructor() { }
}
