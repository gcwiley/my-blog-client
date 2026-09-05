import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  public readonly isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  public readonly isSpeaking = signal(false);

  private speakTimeout: ReturnType<typeof setTimeout> | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  // controls speech synthesis for the application
  public speak(text: string): void {
    if (!this.isSupported || !text.trim()) {
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    this.activeUtterance = utterance;

    utterance.onstart = () => {
      if (this.activeUtterance === utterance) {
        this.isSpeaking.set(true);
      }
    };

    utterance.onend = () => {
      if (this.activeUtterance === utterance) {
        this.activeUtterance = null;
        this.isSpeaking.set(false);
      }
    };

    utterance.onerror = (event) => {
      if (this.activeUtterance !== utterance) {
        return;
      }

      this.activeUtterance = null;
      this.isSpeaking.set(false);

      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error('Speech Synthesis error:', event.error);
      }
    };

    // some chromium-based browsers may fail to speak immediately after cancel().
    this.speakTimeout = setTimeout(() => {
      this.speakTimeout = null;

      if (this.activeUtterance == utterance) {
        window.speechSynthesis.speak(utterance);
      }
    }, 100);
  }

  // stops any ongoing speech synthesis
  public stop(): void {
    if (!this.isSupported) {
      return;
    }

    if (this.speakTimeout !== null) {
      clearTimeout(this.speakTimeout);
      this.speakTimeout = null;
    }

    this.activeUtterance = null;
    window.speechSynthesis.cancel();
    this.isSpeaking.set(false);
  }

  // toggles speech synthesis: stops if speaking, otherwise starts speaking the provided text
  public toggle(text: string): void {
    if (this.isSpeaking()) {
      this.stop();
      return;
    }

    this.speak(text);
  }
}
