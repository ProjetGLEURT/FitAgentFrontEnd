import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private speechRecognition: SpeechRecognition
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        console.log('Droit d\'utiliser la reconnaissance vocale ? : ' + hasPermission);

        if(!hasPermission) {
          this.requestSpeechRecognitionPermission();
        }
      })
    });
    
  }
  private requestSpeechRecognitionPermission(): void {
    this.speechRecognition.requestPermission()
    .then(
      () => document.getElementById("p1").innerHTML = "Permission accordée",
      () => document.getElementById("p1").innerHTML = "Permission refusé"
    )
  }
}
