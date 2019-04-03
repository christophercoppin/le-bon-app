import { Component, OnInit, Input } from '@angular/core';
import { Restaurant } from '../restaurant';
import { RestaurantService } from '../restaurant.service';
import { Rating } from '../rating';



@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss']
})
export class RestaurantDetailsComponent implements OnInit {

  @Input() element: HTMLElement;
  
  selectedRestaurant: Restaurant = this.restaurantService.selectedRestaurant;
  
  constructor(private restaurantService: RestaurantService) { }
  ngOnInit(): void {
    

    if( this.selectedRestaurant.placeId !== '') {
      const request = {
        placeId: this.selectedRestaurant.placeId,
        language: navigator.language,
        fields: ["reviews"]
      }

      this.restaurantService.service.getDetails(request, (place, status) => {
        if(status == google.maps.places.PlacesServiceStatus.OK) {
          place.reviews.sort(function(a, b) {return (a.time as number) - (b.time as number)});
          place.reviews.reverse();
          for( let review of place.reviews) {
            

            const saveRating: Rating = {
              name: review.author_name,
              date: new Date(review.time as number * 1000),
              relativeTimeDescription: review.relative_time_description,
              stars: review.rating,
              comment: review.text
            }
            this.selectedRestaurant.ratings.push(saveRating);
            
          }
        }
        const scrollElement = document.querySelector(`.restaurant-${this.restaurantService.selectedRestaurant.placeId}`);
            scrollElement.scrollIntoView({behavior: "smooth"});
        /* this.element.scrollIntoView({behavior: "smooth"}); */
      });

      
      /* const selectedElement = document.querySelector('.restaurant.selected');
          selectedElement.scrollIntoView({behavior: 'smooth'}); */
    }
  }

  activeFilter: number = 0;

  

  hoverStar(e , starId) {

    const fullStars = document.querySelectorAll('.rating .full-star');

    fullStars.forEach(fullStar => {
      fullStar.classList.remove('full-star');
    })

    for(let i = 0; i < starId; i++) {
      document.querySelector(`.rating .star-${1 + i}`).classList.add('full-star');
    }

  }

  mouseOut() {
    const fullStars = document.querySelectorAll('.rating .full-star');

    fullStars.forEach(fullStar => {
      fullStar.classList.remove('full-star');
    })

    for(let i = 0; i < this.activeFilter; i++) {
      document.querySelector(`.rating .star-${i + 1}`).classList.add('full-star');
    }


  }

  onClick(starId: number) {
    this.activeFilter = starId;
  }

  addRating(pseudo: string = 'Inconnu', comment: string) {


    const rating: Rating = {name: pseudo,
    date: new Date(),
    relativeTimeDescription: '',
    stars: this.activeFilter, 
    comment: comment}
    
    this.restaurantService.selectedRestaurant.ratings.unshift(rating);
    this.selectedRestaurant.rating = this.restaurantService.setRatingAverage(this.restaurantService.selectedRestaurant.ratings);
    this.activeFilter = 0;
    this.mouseOut();
  }
  
}
