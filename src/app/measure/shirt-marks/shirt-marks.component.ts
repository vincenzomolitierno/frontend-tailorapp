import { Component, AfterViewInit, ViewChild, DoCheck, Output, EventEmitter, AfterContentInit, SimpleChange, Directive, HostListener, ElementRef, Input } from '@angular/core';

// import { saveAs } from 'file-saver';
import { I18nInterface, ImageDrawingComponent } from 'ngx-image-drawing';
import { isUndefined } from 'util';
import { Observable, Observer } from 'rxjs';

import { Base64Utility } from '../data.model';

// // Si importa la direttiva
// import { HostDirective } from './myhost-directive';

@Component({
  selector: 'app-shirt-marks',
  templateUrl: './shirt-marks.component.html',
  styleUrls: ['./shirt-marks.component.css'],  
})
export class ShirtMarksComponent {

    viewOldBase64: boolean = false;

    public locale: string = 'en';
    // public width = window.innerWidth ;
    // public height = window.innerHeight ;
    public width = 460;
    public height = 200; 
    
	public Aggiorna = false;
    public Appunti: string ;
    
    @Output() sendBase64 = new EventEmitter<string>();

    public AppuntiBase64;
    
    public i18n: I18nInterface = {
        saveBtn: 'Salva le modifiche!',
        sizes: {
            extra: 'Extra'
        }
    };

    @ViewChild(ImageDrawingComponent, { static: false })
    private IDC: ImageDrawingComponent;    
	
    constructor() {        
        this.locale = this.getNavigatorLanguage();
        this.viewOldBase64 = false;
    }


    pulisci() {
        this.IDC.clearCanvas();
        //Aggiunto
        this.Appunti = "../../assets/images/CamiciaCompleta.jpg";       
        this.AppuntiBase64 = Base64Utility.base64ShirtEmpty;
        // this.Appunti = this.AppuntiBase64;
        this.sendBase64.emit(this.AppuntiBase64);

     }    

    catturadisegno() {
        console.log('catturadisegno'); 
        this.AppuntiBase64 =  this.IDC.getImage();	
    }

    public  CaricaBase(event: MouseEvent){
        console.log('CaricaBase');  
        this.Appunti = "../../assets/images/CamiciaCompleta.jpg";
    }

    public CaricaModificata(event: MouseEvent){   
        console.log('CaricaModificata');     
        this.Appunti = this.AppuntiBase64;
    }

    
    private getNavigatorLanguage = () => (navigator.languages && navigator.languages.length) ? navigator.languages[0] : (navigator as any).userLanguage || navigator.language || (navigator as any).browserLanguage || 'en';


    // ngOnInit(): void {
    //     this.viewOldBase64 = false;        
    // }
    // ngAfterViewInit(): void {
    //     console.log('ngAfterViewInit');
    //     this.Appunti = "../../assets/images/CamiciaCompleta.jpg";
    // }

    public notificaAppuntiBase64(){

        this.AppuntiBase64 =  this.IDC.getImage();	
        this.Appunti = this.AppuntiBase64;
        console.log(this.AppuntiBase64);
        console.log('invio degli appunti + base64 al parent');      
        this.sendBase64.emit(this.AppuntiBase64);
          
    }

    @Input()
    set base64(base64: string) {

        if(!isUndefined(base64)){

            console.log('setting base64');
            this.AppuntiBase64 = 'data:image/png;base64,' + base64;
            this.Appunti = this.AppuntiBase64;

            // console.log(base64);
            // this.Appunti = "../../assets/images/CamiciaCompleta.jpg";
            // this.dataURItoBlob(base64).subscribe(blob => {
            //     console.log('trasformazione fatta');
            //     var blobUrl = URL.createObjectURL(blob);
            //     var img = document.createElement('img');
            //     var divBase64 = document.getElementById('base64')
            //     img.src = blobUrl;
            //     divBase64.appendChild(img);
            // });            
        }  else
            this.Appunti = "../../assets/images/CamiciaCompleta.jpg";

        // this.AppuntiBase64 = base64;
        // this.Appunti = 'data:image/png;base64,' + base64;        
        // this.AppuntiBase64 = 'data:image/png;base64,' + base64;
        // this.Appunti = 'data:image/png;base64,' + base64;
    }


    /* Method to convert Base64Data Url as Image Blob */
    private dataURItoBlob(dataURI: string): Observable<Blob> {
        return Observable.create((observer: Observer<Blob>) => {
          const byteString: string = window.atob(dataURI);
          const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
          const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([int8Array], { type: "image/jpeg" });
          observer.next(blob);
          observer.complete();
        });
      }  
      
      
      

  }



