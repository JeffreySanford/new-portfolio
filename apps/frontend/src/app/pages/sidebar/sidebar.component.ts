import { Component, HostListener, EventEmitter, Output } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

interface Item {
  icon: string;
  label: string;
  routerLink?: string;
  action?: string;
  active: boolean;
}

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
  @Output() toggle = new EventEmitter<boolean>();
  isCollapsed = false;

  menuItems: Item[] = [
    { icon: 'home', label: 'Home', routerLink: '/', active: false },
    { icon: 'table_chart', label: 'Table', routerLink: '/table', active: false },
    { icon: 'bar_chart', label: 'Data Visualizations', routerLink: '/data-visualizations', active: false },
    { icon: 'restaurant', label: 'Peasant Kitchen', routerLink: '/peasant-kitchen', active: false },
    { icon: 'movie', label: 'HTML Video', routerLink: '/space-video', active: false }
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    this.isCollapsed = width < 800;
    this.toggle.emit(!this.isCollapsed);
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit(!this.isCollapsed);
  }

  setActive(item: Item) {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
  }

  getActiveItemLabel(): string {
    const activeItem = this.menuItems.find(item => item.active);
    return activeItem ? activeItem.label : '';
  }
}