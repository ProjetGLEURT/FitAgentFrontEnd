import { Component } from '@angular/core';
import { GoogleService } from './../global';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public GoogleService:GoogleService) {}

}
