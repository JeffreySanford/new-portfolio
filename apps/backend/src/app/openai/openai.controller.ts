import { Controller, Get, Query } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { Observable } from 'rxjs';
import { from } from 'rxjs';

@Controller('ai')
export class OpenAIController {
  constructor(private readonly openAiService: OpenAIService) {}

  @Get('response')
  getAiResponse(@Query('prompt') prompt: string): Observable<string> {
    return this.openAiService.getResponse(prompt);
  }

  @Get()
  getSummary(@Query('page') page: string): Observable<string> {
      return from(this.getSummary(page));
  }
}
