import { Rating } from './rating';

export class Restaurant {
    label: string;
    placeId: string;
    restaurantName: string;
    address: string;
    lat: number;
    long: number;
    rating: number;
    photo: string;
    ratings: Rating[];
}