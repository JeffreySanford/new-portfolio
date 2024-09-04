import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'frontend';
  private routerSubscription!: Subscription;
  private videoCheckSubscription!: Subscription;
  isExpanded = false;
  isSmallScreen = false;
  isCollapsed = false;;

  constructor(private router: Router, private route: ActivatedRoute, private breakpointObserver: BreakpointObserver) { }
  
  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isSmallScreen = result.matches;
      this.isCollapsed = this.isSmallScreen;
    });
  }

  ngAfterViewInit() {
    console.log('Step 2: ngAfterViewInit called');
    this.ensureVideoIsPlaying();
    this.addUserInteractionListener();
    this.startVideoCheckPolling();
  }

  ngOnDestroy() {
    console.log('Step 4: ngOnDestroy called');
    this.removeUserInteractionListener();
    this.stopVideoCheckPolling();
    // Cleanup logic here
  }

  toggleSidebar(event: boolean) {
    this.isCollapsed = !this.isCollapsed;
  }

  private ensureVideoIsPlaying() {
    const video = document.getElementById('background-video') as HTMLVideoElement;
    if (video) {
      console.log('Checking if video is playing');
      video.playbackRate = 0.5; // Slow down the video
      if (video.paused || video.ended) {
        console.log('Video is paused or ended, attempting to play');
        video.play().then(() => {
          console.log('Video started playing, stopping polling');
          this.stopVideoCheckPolling();
        }).catch(error => {
          console.error('Error attempting to play the video:', error);
        });
      } else {
        console.log('Video is already playing, stopping polling');
        this.stopVideoCheckPolling();
      }
    } else {
      console.error('Video element not found');
    }
  }

  private addUserInteractionListener() {
    console.log('Adding user interaction listeners');
    document.addEventListener('click', this.handleUserInteraction);
    document.addEventListener('keydown', this.handleUserInteraction);
  }

  private removeUserInteractionListener() {
    console.log('Removing user interaction listeners');
    document.removeEventListener('click', this.handleUserInteraction);
    document.removeEventListener('keydown', this.handleUserInteraction);
  }

  private handleUserInteraction = () => {
    console.log('User interaction detected');
    this.ensureVideoIsPlaying();
  }

  private startVideoCheckPolling() {
    const videoCheckInterval = interval(5000); // Emit every 5 seconds
    this.videoCheckSubscription = videoCheckInterval.subscribe(() => {
      this.ensureVideoIsPlaying();
    });
  }

  private stopVideoCheckPolling() {
    if (this.videoCheckSubscription) {
      this.videoCheckSubscription.unsubscribe();
    }
  }
}