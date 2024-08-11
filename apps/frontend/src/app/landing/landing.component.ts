import { Component, OnInit } from '@angular/core';
import { OpenAIService } from '../openai/openai.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  items = ['Architect', 'Developer', 'Designer'];
  constructor(private openAIService: OpenAIService) {}

  ngOnInit(): void {
    this.startVoiceRecognition();
  }

  startVoiceRecognition(): void {
    const SpeechRecognition: any =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    debugger;
    if (!SpeechRecognition) {
      console.error('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.getAiResponse(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  getAiResponse(prompt: string): void {
    this.openAIService.getAiResponse(prompt).subscribe(
      (response: any) => {
        this.speak(response);
      },
      (error: any) => {
        console.error('Error fetching AI response:', error);
      }
    );
  }

  speak(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
}
