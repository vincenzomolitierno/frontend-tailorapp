export class BackendServer {

    // private host: string = 'gbiot.ddns.net';
    private host: string = 'localhost';
    private port: string = '5003';
    private protocol: string = 'http';
    
    private base: string = '/api';
    private apiResourceAuthtoken: string = this.base + '/users/authenticate';
    private apiResourceCustomers: string = this.base + '/clienti';

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
            case 'customers':

                this.protocol + '://' + this.host + ':' + this.port + this.apiResourceCustomers;                  
                break;

            case 'authenticate':

                this.protocol + '://' + this.host + ':' + this.port + this.apiResourceAuthtoken;                  
                break;
        
            default:
                break;
        }

        return '';
        
    }    

}
