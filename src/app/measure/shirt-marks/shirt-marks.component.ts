import { Component, AfterViewInit, ViewChild, DoCheck, Output, EventEmitter, AfterContentInit, SimpleChange, Directive, HostListener } from '@angular/core';

// import { saveAs } from 'file-saver';
import { I18nInterface, ImageDrawingComponent } from 'ngx-image-drawing';

// Si importa la direttiva
import { HostDirective } from './myhost-directive';

@Component({
  selector: 'app-shirt-marks',
  templateUrl: './shirt-marks.component.html',
  styleUrls: ['./shirt-marks.component.css'],  
})
export class ShirtMarksComponent implements AfterViewInit {

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
    }


    pulisci() {
        this.IDC.clearCanvas();
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


    ngAfterViewInit(): void {
        console.log('ngAfterViewInit');
        this.Appunti = "../../assets/images/CamiciaCompleta.jpg";
    }

    // ngOnDestroy(){
    //     this.AppuntiBase64 =  this.IDC.getImage();	
    //     this.sendBase64.emit(this.AppuntiBase64);
    //     console.log('ngOnDestroy');        
    // }


    notificaAppuntiBase64(){
        this.AppuntiBase64 =  this.IDC.getImage();	
        this.sendBase64.emit(this.AppuntiBase64);
        console.log('sendAppuntiBase64toParent');
    }

  }

