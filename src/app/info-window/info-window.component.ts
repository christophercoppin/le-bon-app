import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { Restaurant } from '../restaurant';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss']
})
export class InfoWindowComponent implements OnInit {

  faInfoCircle = faInfoCircle;
  @Input() clickOnMapPositionAddress: string = '';
  @Output() cancelAddRestaurant: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() newRestaurant: EventEmitter<Restaurant> = new EventEmitter<Restaurant>();
  constructor(private restaurantService: RestaurantService) {   }

  ngOnInit() {
  }


  cancelNewRestaurant() {
    this.restaurantService.newRestaurant.setMap(null);
    this.restaurantService.newRestaurant = undefined;
    this.cancelAddRestaurant.emit(true);
  }

  onSubmit(restaurantName: string, restaurantAddress: string) {
    
    const newRestaurant: Restaurant = {
      label: 'C',
      restaurantName: restaurantName,
      address: restaurantAddress,
      placeId: '',
      lat: this.restaurantService.newRestaurant.getPosition().lat(),
      long: this.restaurantService.newRestaurant.getPosition().lng(),
      photo: `https://maps.googleapis.com/maps/api/streetview?size=1200x300&location=${this.restaurantService.newRestaurant.getPosition().lat()},${this.restaurantService.newRestaurant.getPosition().lng()}&key=AIzaSyBVEp-IBuwZ89IFU305U388ctFMNlJaou8`,
      rating: 1,
      ratings: []
    }

    
    
    this.newRestaurant.emit(newRestaurant);
  }

  
}
