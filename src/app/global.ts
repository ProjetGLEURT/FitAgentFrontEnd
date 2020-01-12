import { Injectable } from '@angular/core';

@Injectable()
export class GoogleService {
  public loginState:boolean = false;
  public tokenGoogle:string = '';
  public emailGoogle:string = '';
}