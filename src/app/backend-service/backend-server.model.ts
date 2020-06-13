export class BackendServer {

    // private host: string = 'gbiot.ddns.net';
    private host: string = 'localhost';
    private port: string = '5003';
    private protocol: string = 'http';
    
    private base: string = '/api';
    private apiResourceAuthtoken: string = this.base + '/users/authenticate';
    private apiResourceCustomers: string = this.base + '/clienti';
    private apiResourceOrders: string = this.base + '/ordini';
    private apiResourceSubcontractors: string = this.base + '/fasonatori';

    // CATALOGHI
    private apiResourceNeckmodel: string = this.base + '/modellocollo';
    private apiResourceWirstmodel: string = this.base + '/modellopolso';
    private apiResourceForwardside: string = this.base + '/avanti';
    private apiResourceBackside: string = this.base + '/indietro';

    constructor() {
    }  


    public getHost(): string {

        return this.host;
        
    }

    public getPort(): string {

        return this.port;
        
    }

    public getProtocol(): string {

        return this.protocol;
        
    }    

    public getApiResource(keyResource: string): string {

        switch (keyResource) {
            case 'authenticate':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceAuthtoken;                  
    
            case 'customers':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceCustomers;                  

            case 'orders':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceOrders;                  

            case 'subcontractors':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceSubcontractors;                  
                    
            case 'neckmodel':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceNeckmodel;   

            case 'wirstmodel':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceWirstmodel;   

            case 'forwardsidemodel':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceForwardside;   

            case 'backsidemodel':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceBackside;   
                            
            default:
                break;
        }

        return '';
        
    }    

}
