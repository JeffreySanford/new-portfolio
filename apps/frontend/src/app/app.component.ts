import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private router: Router, private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const page = this.route.snapshot.firstChild?.routeConfig?.path || 'homepage';
      console.log(`Page visited: ${page}`);
  });
  }
}
