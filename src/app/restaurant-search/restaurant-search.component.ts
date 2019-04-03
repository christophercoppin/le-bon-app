import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { faSearchLocation, faWindowClose } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-restaurant-search',
  templateUrl: './restaurant-search.component.html',
  styleUrls: ['./restaurant-search.component.scss']
})
export class RestaurantSearchComponent implements OnInit {

  @Input() filterResult: number;
  @Output() actualFilter: EventEmitter<object> = new EventEmitter<object>();
  faSearchLocation = faSearchLocation;
  faWindowClose = faWindowClose;
  filter = {
    filterActive: false,
    setInterval: false,
    startFilter: 1,
    endFilter: 5,
  };


  constructor() { }

  ngOnInit() {
  }

  hoverStar(e , starId) {

    const fullStars = document.querySelectorAll('.search .full-star');

    fullStars.forEach(fullStar => {
      fullStar.classList.remove('full-star');
    })
    if ( this.filter.setInterval ) {
    for(let i = this.filter.startFilter; i <= starId; i++) {
      document.querySelector(`.search .star-${i}`).classList.add('full-star');
    }
  } else {
    document.querySelector(`.search .star-${starId}`).classList.add('full-star');
  }

  }

  mouseOut(e, starId) {
    const fullStars = document.querySelectorAll('.search .full-star');

    fullStars.forEach(fullStar => {
      fullStar.classList.remove('full-star');
    })

    
      for(let i = this.filter.startFilter; i <= this.filter.endFilter; i++) {
        document.querySelector(`.search .star-${i}`).classList.add('full-star');
      }
    


  }

  onClick(starId: number) {

    if ( this.filter.setInterval ) {
      if ( this.filter.startFilter <= starId ) {
        this.filter.endFilter = starId;
        this.filter.setInterval = false;
        this.actualFilter.emit(this.filter);
      }
    } else {
      this.filter.startFilter = starId;
      this.filter.endFilter = starId;
      this.filter.setInterval = true;
      this.actualFilter.emit(this.filter);
    }
  }


  initFilter(filterStatu) {
    this.filter.filterActive = filterStatu;

    this.filter.startFilter = 1;
    this.filter.endFilter = 5;
    this.filter.setInterval = false;

    this.actualFilter.emit(this.filter);

  }
}
