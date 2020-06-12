export class Customer {
    idclienti: number;
    nominativo: string;
    telefono: number;
    email: string;
    cf: string;
    partita_iva: number;
    indirizzo: string;
    int_fattura: string;
    note: string;  
}

export class User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    token: string;
}

export class Order {
    idordini: number;
    note: string;
    acconto: number;
    saldo: number;
    totale: number;
    consegnato: string;
    saldato: string;
    note_x_fasonista: string;
    mod_consegna: string;
    data_ordine: string;
    data_consegna: string;
    clienti_idclienti: number;
    fasonatori_idfasonatori: number;
    id_misure_ordinate: number
  }