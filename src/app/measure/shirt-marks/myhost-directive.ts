
import {HostListener,Directive} from '@angular/core';

@Directive({selector: '[myDirective]'})
export class HostDirective {

  constructor(){}
    

  @HostListener('mouseout') onHover() {
    window.alert('blur shirt');
  }
 
}


