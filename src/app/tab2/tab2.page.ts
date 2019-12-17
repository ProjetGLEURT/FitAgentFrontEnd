import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  isSpeechAvailable=false;
  isListening = false;
  matches: Array<string> = [];

  constructor(private speechRecognition: SpeechRecognition,private tts: TextToSpeech,private platform: Platform,private changeDetectorRef: ChangeDetectorRef) {
    platform.ready().then(() => {

      // Check if SpeechRecognition available or not :/
      this.speechRecognition.isRecognitionAvailable()
      .then((available: boolean) => {
        this.isSpeechAvailable = available;
        document.getElementById("p1").innerHTML = "Permission accordée";
      })
      
    });
  }
  public sayHello(): void {
    this.tts.speak('Hello World')
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
  }

  public startListening(): void {
      this.isListening = true;
      this.matches = [];
      
      let options = {
        language: 'fr-FR',
        matches: 5,
        prompt: 'Je vous écoute ! :)',  // Android only
        showPopup: true,                // Android only
        showPartial: false              // iOS only
      }
      this.speechRecognition.startListening(options)
      .subscribe(
        (matches: Array<string>) => {
          this.isListening = false;
          this.matches = matches;
          this.changeDetectorRef.detectChanges();
        },
        (onerror) => {
          this.isListening = false;
          this.changeDetectorRef.detectChanges();
          console.log(onerror);
        }
      )
    }

  public stopListening(): void {
    this.speechRecognition.stopListening();
  }

}
