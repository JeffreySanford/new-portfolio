import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-space-video',
  templateUrl: './space-video.component.html',
  styleUrls: ['./space-video.component.scss']
})
export class SpaceVideoComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

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
