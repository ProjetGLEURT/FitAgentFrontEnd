import { Component } from '@angular/core';
 
import { LoginService } from '../login.service';
import { GoogleService } from './../global';
import { Events } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  address: string = 'address';
  hideUp=false;
  form={}
  

  constructor(private loginService: LoginService,public GoogleService:GoogleService,public events: Events,private http: HTTP) {
    events.subscribe('user:connected', (addr) => {
      this.askInfos(addr)
    });
  }

  

  public askInfos(addr:string):void{
    document.getElementById("infosUser").innerHTML=""
    document.getElementById("btnLog").innerHTML="Changer de compte"
    this.address=addr
    this.hideUp=true
    
  }

  public update():void {
    let btnUp=document.getElementById("btnUp")
    btnUp.innerHTML="Mettre à jour<ion-spinner name='crescent'></ion-spinner>"
      console.log(this.form)
      console.log(this.form["addr"])

      this.http.get('https://us-central1-fitagent.cloudfunctions.net/updateFirebaseInfo', {}, { address : this.form["addr"] , Authorization : "Bearer "+this.GoogleService.tokenGoogle  })
      .then(data => {
        btnUp.innerHTML="Mettre à jour"
        console.log(data.data); // data received by server
      })
      .catch(error => {
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
      });
    }
}

