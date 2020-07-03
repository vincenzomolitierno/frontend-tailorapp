import server from "../../assets/setting/server.json";


export class BackendServer {

    private host: string = '';
    private port: string = '';
    private protocol: string = 'http';
    
    private base: string = '/api';
    private apiResourceAuthtoken: string = this.base + '/users/authenticate';
    private apiResourceCustomers: string = this.base + '/clienti';
    private apiResourceSubcontractors: string = this.base + '/fasonatori';
    private apiResourceMeasurers: string = this.base + '/misurometri';
    
    private apiResourceMeasures: string = this.base + '/misure';
    private apiResourceMeasuresQuery: string = this.base + '/misurevalues';

    // ORDINI
    private apiResourceOrders: string = this.base + '/ordini';
    private apiResourceOrdersQuery: string = this.base + '/ordiniValues';

    // CATALOGHI
    private apiResourceNeckModels: string = this.base + '/modellocollo';
    private apiResourceWristModels: string = this.base + '/modellopolso';
    private apiResourceForwardsideModels: string = this.base + '/avanti';
    private apiResourceBacksideModels: string = this.base + '/indietro';

    //CAMICIE
    private apiResourceShirts: string = this.base + '/camicie';
    private apiResourceShirtsQuery: string = this.base + '/camicieValues';

    private apiResourceUsers: string = this.base + '/users';


    constructor() {
        //si recuperano host e porta del backend dal file di configurazione
        this.getSetting();
    }  

    private getSetting(){

        // console.log('Reading local json files');
        // console.log(server);      
        
        this.host = server.host;
        this.port = server.port;

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
            
            case 'ordersValues':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceOrdersQuery;

            case 'subcontractors':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceSubcontractors;                  
                    
            case 'measurers':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceMeasurers;                  

            case 'neckmodels':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceNeckModels;   

            case 'wristmodels':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceWristModels;   

            case 'forwardsidemodels':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceForwardsideModels;   

            case 'backsidemodels':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceBacksideModels;   

            case 'measures':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceMeasures;   

            case 'measuresQuery':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceMeasuresQuery;   

            case 'shirts':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceShirts;                   

            case 'shirtsQuery':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceShirtsQuery;   

            case 'users':
                return this.protocol + '://' + this.host + ':' + this.port + this.apiResourceUsers;                
                    
            default:
                break;
        }

        return '';
        
    }    

}
