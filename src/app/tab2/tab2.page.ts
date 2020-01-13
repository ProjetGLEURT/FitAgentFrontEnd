import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { GoogleService } from './../global';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  jsonevent: any;
  actualeventshow: string = "";
  hideDel = false;
  hideList = false;

  constructor(public GoogleService: GoogleService, private platform: Platform, private http: HTTP) {
    platform.ready().then(() => {
    });
  }


  private loadEvent(): void {
    this.hideDel = false
    this.hideList = true
    console.log(this.GoogleService.tokenGoogle)
    let buttonload = document.getElementById("loadEvent")

    buttonload.innerHTML = "Charger vos activités<ion-spinner name='crescent'></ion-spinner>"

    this.http.get('https://us-central1-fitagent.cloudfunctions.net/apiActiviteUser', {}, { Authorization: "Bearer " + this.GoogleService.tokenGoogle })
      .then(data => {
        buttonload.innerHTML = "Charger vos activités"
        console.log(data.data);
        let jsonData = JSON.parse(data.data);
        this.jsonevent = jsonData;
        let actlist = document.getElementById("actlist")
        actlist.innerHTML = ""
        console.log(jsonData)
        for (var key in jsonData) {
          console.log("Key: " + key);
          console.log("Value: " + jsonData[key]);
          let infos = jsonData[key]
          actlist.innerHTML += "<ion-select-option value=" + key + ">" + infos["name"] + "</ion-select-option>"
        }
      })
      .catch(error => {
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
      });
  }

  private showselected(value: string): void {
    console.log(value)
    this.hideDel = true
    this.actualeventshow = value
    let divlEvent = document.getElementById("infosEvent")
    let listeinfos = "<ion-list>"
    listeinfos += "<ion-list-header><h2>" + this.jsonevent[value]["name"] + "</h2></ion-list-header>"
    listeinfos += "<ion-item><ion-label>Adresse : " + this.jsonevent[value]["address"]["address"] + "</ion-label></ion-item>"
    listeinfos += "<ion-item><ion-label>Durée : " + this.jsonevent[value]["duration"] + "</ion-label></ion-item>"
    listeinfos += "<ion-item><ion-label>Fréquence : " + this.jsonevent[value]["frequence"] + "</ion-label></ion-item>"
    listeinfos += "<ion-item><ion-label>Nombre de seance sur la période : " + this.jsonevent[value]["nbSeance"] + "</ion-label></ion-item>"
    listeinfos += "<ion-item><ion-label>Interieure/Exterieure : " + this.jsonevent[value]["placeType"] + "</ion-label></ion-item>"
    listeinfos += "<ion-item><ion-label>Trajet depuis domicile : " + this.jsonevent[value]["homeTime"] + " min</ion-label></ion-item>"
    listeinfos += "<ion-item><ion-label>Trajet depuis Travail : " + this.jsonevent[value]["workTime"] + " min</ion-label></ion-item>"
    listeinfos += "</ion-list>"
    divlEvent.innerHTML = listeinfos
  }

  private delEvent(): void {
    console.log(this.GoogleService.tokenGoogle)
    let buttondel = document.getElementById("delEvent")
    buttondel.innerHTML = "Supprimer cette activité<ion-spinner name='crescent'></ion-spinner>"

    this.http.get('https://us-central1-fitagent.cloudfunctions.net/apiSupprimerActiviteUser?id=' + this.actualeventshow, {}, { Authorization: "Bearer " + this.GoogleService.tokenGoogle })
      .then(data => {
        buttondel.innerHTML = "Supprimer cette activité"
        let actlist = document.getElementById("actlist")
        actlist.innerHTML = ""
        let divlEvent = document.getElementById("infosEvent")
        divlEvent.innerHTML = ""
        this.loadEvent()
        console.log(data.data); // data received by server


      })
      .catch(error => {
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
      });
  }

}
