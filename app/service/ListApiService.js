class ListApiService extends BaseAPIService{
    constructor() {
        super();
        this.baseUrl = "http://localhost:3333"
    }
    getAllList(){
        return fetchJSON(this.baseUrl+"/lists",this.token);
    }

    getListById(id){
        return fetchJSON(this.baseUrl+'/list/'+id,this.token)
    }
    delete(id) {
        this.headers.delete('Content-Type')
        return fetch(`${ this.baseUrl}/list/${id}`, { method: 'DELETE', headers: this.headers})
    }
    insert(list) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch( this.baseUrl+'/list/', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(list)
        })
    }
    update(list) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.baseUrl+'/list/', {
            method: 'PUT',
            headers:  this.headers,

            body: JSON.stringify(list)
        })
    }
}