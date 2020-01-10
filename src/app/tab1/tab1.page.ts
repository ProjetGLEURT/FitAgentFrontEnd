import { Component } from '@angular/core';
 
import { LoginService } from '../login.service';
import { GoogleService } from './../global';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private loginService: LoginService,public GoogleService:GoogleService) {}


}

