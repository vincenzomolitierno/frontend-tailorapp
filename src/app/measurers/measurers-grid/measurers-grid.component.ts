import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { MeasurerFormComponent } from '../measurer-form/measurer-form.component';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Measurer } from '../data.model';

@Component({
  selector: 'app-measurers-grid',
  templateUrl: './measurers-grid.component.html',
  styleUrls: ['./measurers-grid.component.css']
})
export class MeasurersGridComponent extends GridModel implements OnInit {

  tag_grid: string = 'misurometri';

    // Colonne visualizzate in tabella
    displayedColumns: string[] = [
      // 'idmisurometri',
      'descrizione',
      // 'idfasonatori',
      'nome_fasonatore',
      // 'update',
      // 'delete'
    ];

    constructor(
      restBackendService: RESTBackendService, // si inietta il servizio
      public dialog: MatDialog
    ) { 
      super(restBackendService); // si innesca il costruttore della classe padre
      this.resource = Array<Measurer>();
    }
  
    //Si inizializza il componente caricando i dati nella tabella
    ngOnInit() {
  
      //si invoca il metodo ereditato per caricare i dati dal backend, passando come
      //parametro in ingresso il tag che identifica la risorsa da recuperare
      this.getRemoteData('measurers');           
  
    }

  openResourceDialog(formModal: string, idCatolog: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idordini: idCatolog, 
      formModal: formModal, 
    };

    const dialogRef = this.dialog.open(MeasurerFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });    
    
  } 

  // override
  public getRemoteData(tagResourse: string):any {

    this.getSubcontractors(); //risorsa fasonatori in recorSetFasonatori

    //chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
    this.restBackendService.getResource(tagResourse).subscribe(
      (data) => {
            this.resource = data; //risorsa misurometri
            // #######################################
            // manipolazione del recordset recuperato
            var recorSetMisurometri: Array<any> = [];
            recorSetMisurometri = data;

            for(let i = 0; i < recorSetMisurometri.length; i++) {

              var idFasonatore: number = recorSetMisurometri[i].idfasonatori;
              var nomeFasonatore = this.recorSetFasonatori.find(x => x.idfasonatori === idFasonatore).nome + 
              ' - ( tel: ' + this.recorSetFasonatori.find(x => x.idfasonatori === idFasonatore).telefono + ' )';
              recorSetMisurometri[i].nome_fasonatore = nomeFasonatore;

            }
            
            // #######################################
            this.resource = recorSetMisurometri;
            this.dataSource = new MatTableDataSource(this.resource);  
            this.dataSource.paginator = this.paginatorTable;    
            this.dataSource.sort = this.sortTable;            
            },
      (error) => {
          this.errorHttpErrorResponse = error;
          this.errorMessage = error.message;
      }
    );
  }

  private recorSetFasonatori: Array<any> = [];
  getSubcontractors() {
    this.restBackendService.getResource('subcontractors').subscribe(
      (data) => {
            console.log(data);
            this.recorSetFasonatori = data;              
            },
      (error) => {
          console.error(error);
          console.error('Message: ' + error.message);
      }
    );
  }
  
}
