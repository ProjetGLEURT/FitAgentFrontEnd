import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { GoogleService } from './../global';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  jsonevent:any;

  constructor(public GoogleService:GoogleService,private speechRecognition: SpeechRecognition,private tts: TextToSpeech,private platform: Platform,private changeDetectorRef: ChangeDetectorRef,private http: HTTP) {
    platform.ready().then(() => {      
    });
  }

  public loadEvent(): void {
    console.log(this.GoogleService.tokenGoogle)
    var divEvent=document.getElementById("listEvent")
    divEvent.innerHTML=""
    var buttonload=document.getElementById("loadEvent")
    buttonload.innerHTML="Afficher vos activités<ion-spinner name='crescent'></ion-spinner>"
    this.http.get('https://us-central1-fitagent.cloudfunctions.net/apiActiviteUser', {}, {})
    .then(data => {
      buttonload.innerHTML="Afficher vos activités"
      console.log(data.data); // data received by server
      var jsonData = JSON.parse(data.data);
      this.jsonevent=jsonData;
      console.log(jsonData)
      divEvent.innerHTML+="<ion-list><ion-item><ion-label>Activités</ion-label><ion-select #C ionChange='onChange(C.value)' id='actlist'></ion-select></ion-item></ion-list>"
      
      for (var key in jsonData) {
        console.log("Key: " + key); 
        console.log("Value: " + jsonData[key]); 
        var infos=jsonData[key]

        var actlist=document.getElementById("actlist")
        actlist.innerHTML+="<ion-select-option value="+infos["name"]+">"+infos["name"]+"</ion-select-option>"
    }
    })
    .catch(error => {
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
    });
  }



  public onChange(value:string): void {
    var divEvent=document.getElementById("listEvent")
    divEvent.innerHTML=value
  }

}
