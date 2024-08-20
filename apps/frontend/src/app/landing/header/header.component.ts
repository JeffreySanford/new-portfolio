import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isSidebarOpen = false;

  toggleSidebar(isOpen: boolean): void {
    this.isSidebarOpen = isOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('mat-sidenav-container')) {
      this.isSidebarOpen = false;
    }
  }
}
