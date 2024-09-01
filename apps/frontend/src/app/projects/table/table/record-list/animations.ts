// animations.ts
import { trigger, state, style, transition, animate } from '@angular/animations';

export const detailExpand = trigger('detailExpand', [
  state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
  state('expanded', style({ height: '*', visibility: 'visible' })),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);

export const flyIn = trigger('flyIn', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('1s ease-in-out', style({ transform: 'translateX(0)' }))
  ])
]);