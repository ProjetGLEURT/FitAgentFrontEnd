import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { googleId } from '../APIKeys/googleId';
import { HTTP } from '@ionic-native/http/ngx';
import { Events } from '@ionic/angular';
import { GoogleService } from './global';
 
declare var window: any;
@Injectable({
 providedIn: 'root'
})
export class LoginService {
 
 constructor(private platform: Platform,public GoogleService:GoogleService,private http: HTTP,public events: Events) {}
 
 public login() {
   
   this.platform.ready()
     .then(this.googleLogin)
     .then(success => 
{
  this.GoogleService.tokenGoogle=success["access_token"];
  document.getElementById("btnLog").innerHTML="Se Connecter<ion-spinner name='crescent'></ion-spinner>"

  this.http.get('https://us-central1-fitagent.cloudfunctions.net/apiInfosUser', {}, {Authorization : "Bearer "+this.GoogleService.tokenGoogle})
  .then(data => {
    
    let jsondata=JSON.parse(data.data)
    console.log(jsondata)
    this.GoogleService.emailGoogle=jsondata["infos"]["email"]
    this.GoogleService.loginState=true
    console.log(this.GoogleService.emailGoogle)

    this.events.publish('user:connected', jsondata["infos"]["address"]);
    
  })
  .catch(error => {
    console.log(error.status);
    console.log(error.error); // error message as string
    console.log(error);
  });
}
       , (error) => {
       console.error(error);
     });
 };

 
 public googleLogin(): Promise<any> {
   return new Promise(function (resolve, reject) {
     const url = `https://accounts.google.com/o/oauth2/auth?client_id=${googleId}` +
       "&redirect_uri=http://localhost:8100" +
       "&scope=email profile https://www.googleapis.com/auth/plus.login " +  "https://www.googleapis.com/auth/calendar "+"https://www.googleapis.com/auth/admin.directory.customer.readonly"+//ICI VOUS POUVEZ AJOUTER TOUT LES SCOPES NECESSAIRE A VOTRE APPLICATION
       "&response_type=token id_token";
     const browserRef = window.cordova.InAppBrowser.open(
       url,
       "_blank",
       "location=no, clearsessioncache=yes, clearcache=yes"
     );
     let responseParams: string;
     let parsedResponse: Object = {};
     browserRef.addEventListener("loadstart", (evt) => {
       if ((evt.url).indexOf("http://localhost:8100") === 0) {
         browserRef.removeEventListener("exit", (evt) => { });
         browserRef.close();
         responseParams = ((evt.url).split("#")[1]).split("&");
         for (var i = 0; i < responseParams.length; i++) {
           parsedResponse[responseParams[i].split("=")[0]] = responseParams[i].split("=")[1];
         }
         if (parsedResponse["access_token"] !== undefined &&
           parsedResponse["access_token"] !== null) {
            console.log(parsedResponse);
            console.log(parsedResponse["access_token"]);
            resolve(parsedResponse);
         } else {
           reject("Problème d’authentification avec Google");
         }
       }
     });
     browserRef.addEventListener("exit", function (evt) {
       reject("Une erreur est survenue lors de la tentative de connexion à Google");
     });
   });
 }
}
