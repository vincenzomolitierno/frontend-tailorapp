import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface OrderElement {  
  order_number: number;
  customer_name: string;
  delivery_date: string;
}

const UNDELIVERED_ORDER_DATA: OrderElement[] = [
  {order_number: 1, customer_name: 'Vincenzo Molitierno', delivery_date: '10/07/2020'},
  {order_number: 2, customer_name: 'Carlo Rossi', delivery_date: '22/07/2020'},
  {order_number: 3, customer_name: 'Andrea Bianchi', delivery_date: '09/09/2020'}
];

const UNPAID_ORDER_DATA: OrderElement[] = [
  {order_number: 1, customer_name: 'Vincenzo Molitierno', delivery_date: '10/07/2020'},
  {order_number: 2, customer_name: 'Carlo Rossi', delivery_date: '22/07/2020'},
  {order_number: 3, customer_name: 'Andrea Bianchi', delivery_date: '09/09/2020'}
];

@Component({
  selector: 'app-home-subpanel',
  templateUrl: './home-subpanel.component.html',
  styleUrls: ['./home-subpanel.component.css']
})
export class HomeSubpanelComponent implements OnInit {

  displayedColumns: string[] = ['order_number', 'customer_name', 'delivery_date', 'view', 'confirm'];
  dataSourceUndeliveredOrder = new MatTableDataSource(UNDELIVERED_ORDER_DATA);
  dataSourceUnpaidOrder = new MatTableDataSource(UNPAID_ORDER_DATA);

  @ViewChild('table1', { read: MatSort, static: true }) sortUndeliveredOrder: MatSort;
  @ViewChild('table2', { read: MatSort, static: true }) sortOrderUnpaid: MatSort;

  filterValues = {};
  filterSelectObj = [];

  testo_ricerca_ordini_non_consegnati: string = '';
  testo_ricerca_ordini_non_saldati: string = '';

  constructor() {
// Object to create Filter for
    this.filterSelectObj = [
      {
        name: 'N°. Ord',
        columnProp: 'order_number',
        options: []
      }, {
        name: 'Cliente',
        columnProp: 'customer_name',
        options: []
      }, {
        name: 'Data Consegna',
        columnProp: 'delivery_date',
        options: []
      }
    ]    
   }

  ngOnInit() {
    this.dataSourceUndeliveredOrder.sort = this.sortUndeliveredOrder;
    this.dataSourceUnpaidOrder.sort = this.sortOrderUnpaid;

  }


  // Get remote serve data using HTTP call
  getRemoteData() {

    const remoteDummyData = [
      {
        "id": 1,
        "name": "Leanne Graham",
        "username": "Bret",
        "email": "Sincere@april.biz",
        "phone": "1-770-736-8031 x56442",
        "website": "hildegard.org",
        "status": "Active"
      },
      {
        "id": 2,
        "name": "Ervin Howell",
        "username": "Antonette",
        "email": "Shanna@melissa.tv",
        "phone": "010-692-6593 x09125",
        "website": "anastasia.net",
        "status": "Blocked"
      },
      {
        "id": 3,
        "name": "Clementine Bauch",
        "username": "Samantha",
        "email": "Nathan@yesenia.net",
        "phone": "1-463-123-4447",
        "website": "ramiro.info",
        "status": "Blocked"
      },
      {
        "id": 4,
        "name": "Patricia Lebsack",
        "username": "Karianne",
        "email": "Julianne.OConner@kory.org",
        "phone": "493-170-9623 x156",
        "website": "kale.biz",
        "status": "Active"
      },
      {
        "id": 5,
        "name": "Chelsey Dietrich",
        "username": "Kamren",
        "email": "Lucio_Hettinger@annie.ca",
        "phone": "(254)954-1289",
        "website": "demarco.info",
        "status": "Active"
      },
      {
        "id": 6,
        "name": "Mrs. Dennis Schulist",
        "username": "Leopoldo_Corkery",
        "email": "Karley_Dach@jasper.info",
        "phone": "1-477-935-8478 x6430",
        "website": "ola.org",
        "status": "In-Active"
      },
      {
        "id": 7,
        "name": "Kurtis Weissnat",
        "username": "Elwyn.Skiles",
        "email": "Telly.Hoeger@billy.biz",
        "phone": "210.067.6132",
        "website": "elvis.io",
        "status": "Active"
      },
      {
        "id": 8,
        "name": "Nicholas Runolfsdottir V",
        "username": "Maxime_Nienow",
        "email": "Sherwood@rosamond.me",
        "phone": "586.493.6943 x140",
        "website": "jacynthe.com",
        "status": "In-Active"
      },
      {
        "id": 9,
        "name": "Glenna Reichert",
        "username": "Delphine",
        "email": "Chaim_McDermott@dana.io",
        "phone": "(775)976-6794 x41206",
        "website": "conrad.com",
        "status": "In-Active"
      },
      {
        "id": 10,
        "name": "Clementina DuBuque",
        "username": "Moriah.Stanton",
        "email": "Rey.Padberg@karina.biz",
        "phone": "024-648-3804",
        "website": "ambrose.net",
        "status": "Active"
      }
    ];

    // this.filterSelectObj.filter((o) => {
    //   o.options = this.getFilterObject(remoteDummyData, o.columnProp);
    // });
  }

  // filtro ordini non consegnati
  applyFilterUndeliveredOrder(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceUndeliveredOrder.filter = filterValue.trim().toLowerCase();
  }  

  clearSearchUndeliveredOrder(){
    this.dataSourceUndeliveredOrder.filter = "";
    this.testo_ricerca_ordini_non_consegnati = "";
  }

   // filtro ordini non saldati
   applyFilterUndpaidOrder(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceUnpaidOrder.filter = filterValue.trim().toLowerCase();
  }  

  clearSearchUnpaidOrder(){
    this.dataSourceUnpaidOrder.filter = "";
    this.testo_ricerca_ordini_non_saldati = "";
  }

}
