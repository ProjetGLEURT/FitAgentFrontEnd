import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { googleId } from '../APIKeys/googleId';
 
declare var window: any;
 
@Injectable({
 providedIn: 'root'
})
export class LoginService {
 
 constructor(private http: HttpClient,
   private platform: Platform,
   ) {}
 
 public login() {
   this.platform.ready()
     .then(this.googleLogin)
     .then(success => 
{
  console.log('success')
}
       , (error) => {
       console.error(error);
     });
 };
 
 
 public googleLogin(): Promise<any> {
   return new Promise(function (resolve, reject) {
     const url = `https://accounts.google.com/o/oauth2/auth?client_id=${googleId}` +
       "&redirect_uri=http://localhost:8100" +
       "&scope=https://www.googleapis.com/auth/plus.login" +  //ICI VOUS POUVEZ AJOUTER TOUT LES SCOPES NECESSAIRE A VOTRE APPLICATION
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
            document.getElementById("p3").innerHTML = parsedResponse["access_token"];
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
