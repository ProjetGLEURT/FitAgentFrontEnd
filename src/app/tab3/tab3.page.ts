import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient'
import { Platform } from '@ionic/angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { FormControl, FormBuilder } from '@angular/forms';




@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  actualspeech: string = '';
  accessToken: string = '9e3fa9be49fa4347a538806b647630f7';
  client;
  messageForm: any;
  chatBox: any;
  isLoading: boolean;
  isSpeechAvailable=false;
  isListening = false;
  matches: Array<string> = [];

  constructor(public platform: Platform,private speechRecognition: SpeechRecognition,private tts: TextToSpeech,private changeDetectorRef: ChangeDetectorRef) {
    this.chatBox = '';
    this.client = new ApiAiClient({
      accessToken: this.accessToken
    });
    platform.ready().then(() => {

      // Check if SpeechRecognition available or not :/
      this.speechRecognition.isRecognitionAvailable()
      .then((available: boolean) => {
        this.isSpeechAvailable = available;
        document.getElementById("p1").innerHTML = "Permission accordée";
      })
      
    });
  }

  public sendMessage(): void {
    let req=this.actualspeech;
    if (!req || req === '') {
      return;
    }
    this.isLoading = true;

    this.client
      .textRequest(req)
      .then(response => {
        console.log('res');
        console.log(response);
        document.getElementById("p2").innerHTML = response.result.fulfillment.speech;
        this.tts.speak(
          {
            text: response.result.fulfillment.speech,
            locale: "fr-FR",
            rate: 1
          })
        .then(() => console.log('Success'))
        .catch((reason: any) => console.log(reason));
        this.isLoading = false;
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });

    this.chatBox = '';
  }
  public startListening(): void {
    this.isListening = true;
    this.matches = [];
    
    let options = {
      language: 'fr-FR',
      matches: 1,
      prompt: 'Je vous écoute ! :)',  // Android only
      showPopup: false,                // Android only
      showPartial: false              // iOS only
    }
    this.speechRecognition.startListening(options)
    .subscribe(
      (matches: Array<string>) => {
        this.isListening = false;
        this.matches[0] = matches[0];
        this.changeDetectorRef.detectChanges();
        this.actualspeech=matches[0];
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
