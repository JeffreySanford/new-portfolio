import { Component, HostListener } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      state('out', style({ transform: 'translateX(0)' })),
      transition('in => out', [animate('1s ease-in')]),
      transition('out => in', [animate('1s ease-out')]),
    ]),
  ],
})
export class SidebarComponent {
  isCollapsed = false;

  menuItems = [
    { icon: 'home', label: 'Home', routerLink: '/' },
    { icon: 'table_chart', label: 'Table', routerLink: '/table' },
    {
      icon: 'bar_chart',
      label: 'Data Visualizations',
      routerLink: '/data-visualizations',
    },
    { icon: 'restaurant', label: 'Restaurant', routerLink: '/restaurant' },
    { icon: 'movie', label: 'Movie', routerLink: '/movie' },
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    this.isCollapsed = width < 800;
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}