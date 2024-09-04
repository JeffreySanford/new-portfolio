import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-space-video',
  templateUrl: './space-video.component.html',
  styleUrls: ['./space-video.component.scss']
})
export class SpaceVideoComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  ngAfterViewInit() {
    this.videoPlayer.nativeElement.muted = true; // Ensure the video is muted
    this.playVideo();
  }

  playVideo() {
    this.videoPlayer.nativeElement.play();
  }

  pauseVideo() {
    this.videoPlayer.nativeElement.pause();
  }

  changeVolume(event: any) {
    this.videoPlayer.nativeElement.volume = event.value;
  }
}