import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls:  ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
  pdfSrc = '../../../assets/documents/Resume - Jeffrey Sanford - Web Developer.pdf';
  

  constructor() { }

  ngAfterViewInit() {
    debugger
    this.pdfSrc = '../../../assets/documents/Resume - Jeffrey Sanford - Web Developer.pdf';
    console.log('Source:', this.pdfSrc);
  }
  ngOnInit(): void {
    debugger
    this.pdfSrc = '../../../assets/documents/Resume - Jeffrey Sanford - Web Developer.pdf';
    console.log('Source:', this.pdfSrc);

  }
}
