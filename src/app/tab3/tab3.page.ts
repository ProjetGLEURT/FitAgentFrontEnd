import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient'
import { Platform } from '@ionic/angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { GoogleService } from './../global';




@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  automode:boolean=false;

  actualspeech: string = '';
  accessToken: string = '9e3fa9be49fa4347a538806b647630f7';
  client;
  messageForm: any;
  chatBox: any;
  isLoading: boolean;
  isSpeechAvailable=false;
  isListening = false;
  matches: Array<string> = [];
  

  constructor(public platform: Platform,private speechRecognition: SpeechRecognition,private tts: TextToSpeech,private changeDetectorRef: ChangeDetectorRef,public GoogleService:GoogleService) {
    this.chatBox = '';
    this.client = new ApiAiClient({
      accessToken: this.accessToken
    });
    platform.ready().then(() => {

      // Check if SpeechRecognition available or not :/
      this.speechRecognition.isRecognitionAvailable()
      .then((available: boolean) => {
        this.isSpeechAvailable = available;
      })
      
    });
  }

  public sendMessage(): void {
    let btnstart=document.getElementById("startLi") 
    btnstart.innerHTML="Start<ion-spinner name='crescent'></ion-spinner>"
    let req=this.actualspeech;
    if (!req || req === '') {
      return;
    }
    this.isLoading = true;
    console.log(this.GoogleService.tokenGoogle)
    this.client
      .textRequest(req,{contexts: [{
        'name': 'test11',
        'lifespan': 5,
        'parameters': {
          'token':this.GoogleService.tokenGoogle,
          'email':this.GoogleService.emailGoogle
        }
      }]})
      .then(response => {
        console.log(response);
        btnstart.innerHTML="Start"
        document.getElementById("p2").innerHTML = response.result.fulfillment.speech;
        this.tts.speak(
          {
            text: response.result.fulfillment.speech,
            locale: "fr-FR",
            rate: 1
          })
        .then(() => {console.log('Success')
        if (this.automode){this.startListening()}
      })
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
      showPopup: true,                // Android only
      showPartial: false              // iOS only
    }
    this.speechRecognition.startListening(options)
    .subscribe(
      (matches: Array<string>) => {
        this.isListening = false;
        this.matches[0] = matches[0];
        this.changeDetectorRef.detectChanges();
        this.actualspeech=matches[0];
        if (this.automode){this.sendMessage()}
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


public tog(value:boolean):void{
  this.automode=value
}


}
