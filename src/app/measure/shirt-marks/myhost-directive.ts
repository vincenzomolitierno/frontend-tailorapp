
import {HostListener,Directive} from '@angular/core';

@Directive({selector: '[myDirective]'})
export class HostDirective {

  constructor(){}
    

  @HostListener('mouseover') onOver() {
    window.alert('blur shirt');
  }
 
}


