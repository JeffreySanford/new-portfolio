import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
}
