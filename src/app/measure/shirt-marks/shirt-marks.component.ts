import { Component, OnInit, AfterViewInit, AfterContentInit, AfterViewChecked, DoCheck, AfterContentChecked, OnChanges, Output, ViewChild } from '@angular/core';
// import { saveAs } from 'file-saver';
import { I18nInterface, ImageDrawingComponent } from 'ngx-image-drawing';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-shirt-marks',
  templateUrl: './shirt-marks.component.html',
  styleUrls: ['./shirt-marks.component.css']
})
export class ShirtMarksComponent implements AfterViewInit, DoCheck {

    public locale: string = 'en';
    // public width = window.innerWidth ;
    // public height = window.innerHeight ;
    public width = 460;
    public height = 200; 
    
	public Aggiorna = false;
	public Appunti: string ;
    public AppuntiBase64;
    
    // @Output() progressChange = new EventEmitter<AppuntiBase64>();

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
        this.AppuntiBase64 =  this.IDC.getImage();	
    }

    public  CaricaBase(event: MouseEvent){
        this.Appunti = "../../assets/images/CamiciaCompleta.jpg";
    }

    public  CaricaModificata(event: MouseEvent){
        this.Appunti = this.AppuntiBase64;
    }

    
    private getNavigatorLanguage = () => (navigator.languages && navigator.languages.length) ? navigator.languages[0] : (navigator as any).userLanguage || navigator.language || (navigator as any).browserLanguage || 'en';

    ngAfterViewInit(): void {
        this.Appunti = "../../assets/images/CamiciaCompleta.jpg";
    }
    ngDoCheck(): void {
        console.log('aggiornato');
    }
  }

