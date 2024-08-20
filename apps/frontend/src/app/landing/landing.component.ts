import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})

export class LandingComponent implements OnInit {
  items = ['Architect', 'Developer', 'Designer'];
  constructor() {}

  ngOnInit(): void {}
}
