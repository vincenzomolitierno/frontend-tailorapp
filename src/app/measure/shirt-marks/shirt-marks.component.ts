import { Component } from '@angular/core';
// import { saveAs } from 'file-saver';
import { I18nInterface } from 'ngx-image-drawing';

@Component({
  selector: 'app-shirt-marks',
  templateUrl: './shirt-marks.component.html',
  styleUrls: ['./shirt-marks.component.css']
})
export class ShirtMarksComponent {

    public locale: string = 'en';
    // public width = window.innerWidth - 60;
    // public height = window.innerHeight - 250;
    public width = 500;
    public height = 200;    

    public i18n: I18nInterface = {
        // saveBtn: 'Salva le modifiche!',
        sizes: {
            extra: 'Extra'
        }
    };

    constructor() {
        this.locale = this.getNavigatorLanguage();
    }

    public saveBtn($event) {
        // saveAs($event, 'image.jpg');
    }
    
    private getNavigatorLanguage = () => (navigator.languages && navigator.languages.length) ? navigator.languages[0] : (navigator as any).userLanguage || navigator.language || (navigator as any).browserLanguage || 'en';
  }

