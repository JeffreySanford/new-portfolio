import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private apiUrl = 'http://localhost:3000/ai/response'; // Replace with your NestJS endpoint

  constructor(private http: HttpClient) {}

  getAiResponse(prompt: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}?prompt=${encodeURIComponent(prompt)}`);
  }

  getSummary(page: string): Observable<string> {
    return this.http.get<string>(`/api/summary?page=${page}`);
  }

  readAloud(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
}
