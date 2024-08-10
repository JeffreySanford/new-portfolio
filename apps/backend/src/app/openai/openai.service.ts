import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class OpenAiService {
  private readonly apiKey = process.env.OPENAI_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  getResponse(prompt: string): Observable<string> {
    const url = 'https://api.openai.com/v1/completions';

    return this.httpService.post(url, {
      model: 'text-davinci-003',
      prompt,
      max_tokens: 150,
    }, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    }).pipe(
      map(response => response.data.choices[0].text.trim())
    );
  }


  private summaries: { [key: string]: string } = {
    homepage: "Welcome to my portfolio. Here, you can find an overview of my work and experiences.",
    projects: "This page showcases various projects I've worked on, including detailed descriptions and technologies used.",
    about: "The About page contains information about my background, skills, and career path.",
    contact: "On the Contact page, you can find ways to reach out to me, including a contact form.",
    // Add summaries for other pages...
  };

  getSummary(page: string): Observable<string> {
    const summary = this.summaries[page] || "Sorry, a summary for this page is not available.";

    const nextStepsPrompt = `Provide next steps or suggestions for a user on the ${page} page of my portfolio.`;

    return this.getResponse(nextStepsPrompt).pipe(
      map(openAiResponse => `${summary} ${openAiResponse}`),
      catchError(error => of(`Error fetching summary: ${error.message}`))
    );
  }
}
