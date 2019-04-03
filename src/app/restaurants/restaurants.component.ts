import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Restaurant } from '../restaurant';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss']
})
export class RestaurantsComponent implements OnInit {

  @Input() clickOnMapAddress: string;
  @Input() positionMarker;
  @Input() restaurants: Restaurant[];
  @Output() selectedRestaurant: EventEmitter<Restaurant> = new EventEmitter<Restaurant>();
  @Output() centerMapPosition: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() activeClickOnMap: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() newRestaurant: EventEmitter<Restaurant> = new EventEmitter<Restaurant>();

  constructor(private restaurantService: RestaurantService) { }

  newSelectedRestaurant: Restaurant = this.restaurantService.selectedRestaurant;
  ngOnInit() {
    
  }

  talkBack(say: Restaurant) {
    this.selectedRestaurant.emit(say);
    this.restaurantService.selectedRestaurant = say;
  }

  centerMapPositionClick() {
    this.centerMapPosition.emit(true);
  }

  addNewRestaurant() {
    this.activeClickOnMap.emit(true);
  }

  cancelAddRestaurant() {
    this.activeClickOnMap.emit(false);
  }

}
