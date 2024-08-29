import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('buttonClick', [
      state('default', style({
        backgroundColor: '*',
      })),
      state('clicked', style({
        backgroundColor: 'blue',
      })),
      state('highlighted', style({
        backgroundColor: 'teal',
      })),
      transition('default => clicked', [
        animate('0.3s')
      ]),
      transition('clicked => default', [
        animate('0.3s')
      ]),
      transition('default => highlighted', [
        animate('0.1s')
      ]),
      transition('highlighted => default', [
        animate('0.1s')
      ])
    ])
  ]
})
export class SidebarComponent {

}
