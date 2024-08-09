import { Controller, Get, Query } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { Observable } from 'rxjs';

@Controller('ai')
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Get('response')
  getAiResponse(@Query('prompt') prompt: string): Observable<string> {
    return this.openAiService.getResponse(prompt);
  }
}
