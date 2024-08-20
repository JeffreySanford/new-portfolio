import { Component } from '@angular/core';

@Component({
  selector: 'app-material-icons',
  templateUrl: './material-icons.component.html',
  styleUrl: './material-icons.component.scss'
})
export class MaterialIconsComponent {

  materialIcons: string[] = [
    'home', 'favorite', 'search', 'account_circle', 'alarm',
    'settings', 'check_circle', 'thumb_up', 'delete', 'info',
    'warning', 'shopping_cart', 'help', 'star', 'lock',
    'visibility', 'attach_file', 'photo_camera', 'event', 'email',
    'print', 'save', 'download', 'upload', 'cloud_upload',
    'refresh', 'share', 'edit', 'arrow_forward', 'cancel',
    'folder', 'file_copy', 'cloud', 'phone', 'map',
    'place', 'location_on', 'directions', 'local_offer', 'local_hospital',
    'local_shipping', 'restaurant', 'flight', 'hotel', 'directions_car',
    'directions_bike', 'directions_bus', 'directions_walk', 'train', 'subway',
    'tram', 'directions_boat', 'local_pizza', 'fastfood', 'local_cafe',
    'local_bar', 'beach_access', 'local_florist', 'local_mall', 'shopping_bag',
    'store', 'attach_money', 'local_grocery_store', 'local_gas_station', 'local_pharmacy',
    'local_laundry_service', 'local_library', 'local_movies', 'local_dining', 'local_hotel',
    'local_activity', 'local_car_wash', 'local_atm', 'local_post_office', 'local_printshop',
    'local_see', 'local_drink', 'local_play', 'local_convenience_store', 'local_parking',
    'local_taxi', 'local_airport_shuttle', 'local_phone', 'local_airport', 'local_parking',
    'local_fire_department', 'local_police', 'local_emergency', 'local_drugstore', 'local_baby_care',
    'local_gym', 'local_office', 'local_fitness_center', 'local_library_books', 'local_child_care',
    'local_forest', 'local_wildlife', 'local_park', 'local_travel',
    // add more icons if needed
  ];
}
