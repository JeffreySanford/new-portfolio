import { Component } from '@angular/core';
import { AiService } from '../openai/openai.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {

  constructor(private aiService: AiService) { }

  ngOnInit(): void {
    this.startVoiceRecognition();
  }

  startVoiceRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

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
    this.aiService.getAiResponse(prompt).subscribe(
      (response) => {
        this.speak(response);
      },
      (error) => {
        console.error('Error fetching AI response:', error);
      }
    );
  }

  speak(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
}
