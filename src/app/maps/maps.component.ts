import { Component, ViewChild, ComponentFactoryResolver } from "@angular/core";

import { Restaurant } from "../restaurant";
import { RestaurantService } from "../restaurant.service";

import {} from "googlemaps";
import { faBullseye, faPlusCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-maps",
  templateUrl: "./maps.component.html",
  styleUrls: ["./maps.component.scss"]
})
export class MapsComponent {
  @ViewChild("map") mapElement: any;
  faMapMarker = faBullseye;
  faAdd = faPlusCircle;
  faInfoCircle = faInfoCircle
  map: google.maps.Map;
  marker: google.maps.Marker;
  markers: google.maps.Marker[] = [];
  mapLoading: boolean;

  place: google.maps.places.PlacesService;

  title: string = "My first AGM project";
  lat: number;
  lng: number;
  latView: number;
  lngView: number;
  clickOnMapActive: google.maps.MapsEventListener;
  clickOnMapSelectPosition: boolean = false;
  clickOnMapPosition: google.maps.LatLngLiteral;
  clickOnMapPositionAddress: string = "";
  geocoder: google.maps.Geocoder = new google.maps.Geocoder();
  infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow();
  icon = {
    url: "https://cdn4.iconfinder.com/data/icons/home3/102/Untitled-12-512.png",
    scaledSize: {
      width: 40,
      height: 40
    }
  };
  selectedRestaurant: Restaurant = this.restaurantService.selectedRestaurant;
  restaurantsVisibles: Restaurant[] = [];
  previousAnimatedMarker: google.maps.Marker;
  restaurants: Restaurant[];
  filter = {
    filterActive: false,
    setInterval: false,
    startFilter: 1,
    endFilter: 5
  };

  constructor(private restaurantService: RestaurantService, private componentFactoryResolver: ComponentFactoryResolver) {}

  getRestaurants() {

    return new Promise( resolve => {
      this.restaurantService.getRestaurants().subscribe(restaurants => {
        this.restaurants = restaurants;
  
        for(let restaurant of restaurants) {
          restaurant.rating = this.restaurantService.setRatingAverage(restaurant.ratings);
  
          for( let rating of restaurant.ratings ) {
            rating.date = new Date(rating.date as number * 1000)
          }
        }

        resolve(true);
      });
    });
  }

  initPosition() {

    return new Promise(resolve => {

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          this.latView = this.lat = position.coords.latitude;
          this.lngView = this.lng = position.coords.longitude;
          
          resolve(true);
          
        });
      } else {
        console.log("geolocation non available");
      }
    });
  }

  async setPosition() {
    this.initPosition().then(() => { 
      this.map.panTo(new google.maps.LatLng(this.latView, this.lngView));
    })
  }

  initMap() {

    return new Promise(resolve => {

      const mapProperties = {
        center: new google.maps.LatLng(this.latView, this.lngView),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      };
      this.map = new google.maps.Map(
        this.mapElement.nativeElement,
        mapProperties
      );

      this.map.setOptions({
        styles: [{
          featureType: 'poi',
          stylers: [{visibility: 'off'}]
        }]
      })
    
        this.restaurantService.map = this.map;
      const markerProperties = {
        position: new google.maps.LatLng(this.lat, this.lng),
        icon: '../../assets/pin.png',
        map: this.map,
        title: "Initial position"
      };
  
      this.marker = new google.maps.Marker(markerProperties);
  
        const request = {
          location: this.map.getCenter(),
          radius: 5000,
          type: "restaurant"
        };
        this.place = new google.maps.places.PlacesService(this.map);
        this.restaurantService.service = this.place;
        this.place.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (let result of results) {
              /* let photo: string;
  
              if ( result.photos !== undefined ) {
                photo = result.photos[0].getUrl({maxHeight: 400});
              } else {
                photo = `https://maps.googleapis.com/maps/api/streetview?size=1200x300&location=${result.geometry.location.lat()},${result.geometry.location.lng()}&key=AIzaSyBVEp-IBuwZ89IFU305U388ctFMNlJaou8`;
              } */
  
              const newRestaurant: Restaurant = {
                label: "C",
                restaurantName: result.name,
                address: result.vicinity,
                placeId: result.place_id,
                lat: result.geometry.location.lat(),
                long: result.geometry.location.lng(),
                photo: '',
                rating:result.rating,
                ratings: []
              };
  
              this.restaurants.push(newRestaurant);
            }
  
            this.setMarkers();
            resolve(true);
          }
        });
  
      const mapListener = () => {
        const mapEventListener = this.map.addListener("bounds_changed", () => {
          google.maps.event.removeListener(mapEventListener);
          
          setTimeout(
            () => {
              this.setRestaurantVisible();
            },
            1000,
            mapListener()
          );
        });
      };
  
      mapListener();
    });
  }

async ngOnInit() {
    this.mapLoading = true;
    await this.getRestaurants();
    await this.initPosition();
    await this.initMap().then(() => { this.mapLoading = false});
    await this.setRestaurantVisible();
  }



  setRestaurantVisible() {
    return new Promise(resolve => {
      const mapCoordinates = this.map.getBounds().toJSON();
      if (this.restaurantsVisibles !== undefined) {
        this.restaurantsVisibles.length = 0;
      }
  
      for (let restaurant of this.restaurants) {
        if (
          restaurant.rating >=
          this.filter.startFilter - 0.5 && restaurant.rating < this.filter.endFilter + 0.5
        ) {
          if (
            restaurant.long < mapCoordinates.east &&
            restaurant.long > mapCoordinates.west &&
            restaurant.lat < mapCoordinates.north &&
            restaurant.lat > mapCoordinates.south
          ) {
            this.restaurantsVisibles.push(restaurant);
          }
        }
      }
      if ( this.restaurantService.selectedRestaurant !== undefined ) {
        /* const scrollElement = document.querySelector(`.restaurant-${this.restaurantService.selectedRestaurant.placeId}`);
            scrollElement.scrollIntoView({behavior: "smooth"}); */
      }
    });
  }

  setMarkers() {
    setTimeout(() => {
      const rest = this.restaurants;
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      /* 
      this.markers.length = 0; */

      for (let i = 0; i < rest.length; i++) {
        if (
          rest[i].rating >=
          this.filter.startFilter - 0.5 && rest[i].rating < this.filter.endFilter + 0.5
        ) {
          setTimeout(() => {
            this.setNewMarker(rest[i]);
          }, i * 100);
        }
      }
    }, 1000);
  }

  setNewMarker(restaurant) {
    const positionMarker = { lat: restaurant.lat, lng: restaurant.long };
    const markerProperties = {
      position: positionMarker,
      icon: '../../assets/placeholder.png',
      map: this.map,
      title: restaurant.restaurantName
    };

    const newMarker = new google.maps.Marker(markerProperties);
    this.markers.push(newMarker);

    newMarker.addListener("click", e => {
      this.restaurantService.selectedRestaurant = restaurant;
      this.map.setCenter(positionMarker);
      this.toggleBounce(newMarker);
      this.setRestaurantVisible();
    });
  }

  toggleBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);

    if (
      this.previousAnimatedMarker !== undefined &&
      this.previousAnimatedMarker.getAnimation() !== null
    ) {
      this.previousAnimatedMarker.setAnimation(-1);
    }
    this.previousAnimatedMarker = marker;
  }

  talkBack(e: Restaurant) {
    this.map.setCenter(new google.maps.LatLng(e.lat, e.long));
    this.map.setZoom(14);
    for (let marker of this.markers) {
      if (e.restaurantName === marker.getTitle()) {
        this.toggleBounce(marker);
      }
    }
  }

  changeBounds(map) {}

  setFilter(star) {
    if(this.clickOnMapSelectPosition) {
      this.clickOnMapSelectPosition = false;
      google.maps.event.removeListener(this.clickOnMapActive);
      if ( this.restaurantService.newRestaurant !== undefined) {
        this.restaurantService.newRestaurant.setMap(null);
        this.restaurantService.newRestaurant = undefined;
      }
      }
    this.restaurantService.selectedRestaurant = undefined;
    this.filter = star;
    this.setMarkers();
    this.setRestaurantVisible();
  }

  activeClickOnMap(e: boolean) {
    if (e) {
    this.filter.filterActive = false;
    this.clickOnMapSelectPosition = true;

      this.clickOnMapActive = this.map.addListener("click", event => {
        if (this.restaurantService.newRestaurant === undefined) {
          this.geocoder.geocode(
            { location: event.latLng },
            (results, status) => {
              if (status === google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  const temporaryMarkerProperties = {
                    position: event.latLng,
                    icon: '../../assets/placeholder.png',
                    map: this.map,
                    title: "Nouveau restaurant"
                  };
                  this.restaurantService.newRestaurant = new google.maps.Marker(
                    temporaryMarkerProperties
                  );

                  this.restaurantService.newRestaurant = this.restaurantService.newRestaurant;
                  this.clickOnMapPositionAddress = results[0].formatted_address;
                  this.infoWindow.setContent('Nouveau restaurant');
                  this.infoWindow.open(this.map, this.restaurantService.newRestaurant);
                } else {
                  window.alert("No results found");
                }
              } else {
                window.alert("Geocoder failed due to : " + status);
              }
            }
          );
        } else {
          this.restaurantService.newRestaurant.setPosition(event.latLng);
          this.geocoder.geocode(
            { location: event.latLng },
            (results, status) => {
              if (status === google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  this.clickOnMapPositionAddress = results[0].formatted_address;
                } else {
                  window.alert("No results found");
                }
              } else {
                window.alert("Geocoder failed due to : " + status);
              }
            }
          );
        }
      });
      /* setTimeout(() => {
        google.maps.event.removeListener(this.clickOnMapActive);
      }, 2000) */
    } else {
      google.maps.event.removeListener(this.clickOnMapActive);
      this.restaurantService.newRestaurant.setMap(null);
      this.restaurantService.newRestaurant = undefined;
    }
  }

  saveNewRestaurant(event) {

    this.restaurants.push(event);
    this.selectedRestaurant = event;

    if (this.restaurantService.newRestaurant !== undefined) {
      this.restaurantService.newRestaurant.setMap(null);
      this.restaurantService.newRestaurant = undefined;
      this.clickOnMapSelectPosition = false;
    }
    google.maps.event.removeListener(this.clickOnMapActive);
    this.setMarkers();
    this.setRestaurantVisible();
  }

  cancelNewRestaurant(value) {
    if (value) {
    google.maps.event.removeListener(this.clickOnMapActive);
    this.clickOnMapSelectPosition = false;
    this.setMarkers();
    this.setRestaurantVisible();
    }
  }
}
