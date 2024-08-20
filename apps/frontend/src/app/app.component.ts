import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'frontend';

  constructor(private router: Router, private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const page = this.route.snapshot.firstChild?.routeConfig?.path || 'homepage';
      console.log(`Page visited: ${page}`);
  });
  }

  ngAfterViewInit() {
    const video = document.getElementById('background-video') as HTMLVideoElement;
    if (video) {
      video.playbackRate = 0.5; // Slow down the video
    }
  }
}
