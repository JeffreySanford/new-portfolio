import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OpenAIService } from './openai/openai.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private openAIService: OpenAIService, private router: Router, private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const page = this.route.snapshot.firstChild?.routeConfig?.path || 'homepage';

      this.openAIService.getSummary(page).subscribe(summary => {
        console.log(`Summary for ${page}: ${summary}`);
        this.openAIService.readAloud(summary);
      });
  });
  }
}
