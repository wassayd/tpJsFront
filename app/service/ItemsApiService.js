class ItemsApiService extends BaseAPIService{
    constructor() {
        super();
        this.baseUrl = "http://localhost:3333"
    }
    getItems(){
        return fetchJSON(`${this.baseUrl}/items/`,this.token)
    }
    getItemsByListId(listId){
        return fetchJSON(`${this.baseUrl}/items/${listId}`,this.token);
    }
    getItem(id){
        return fetchJSON(`${this.baseUrl}/item/${id}`,this.token)
    }
    delete(id) {
        this.headers.delete('Content-Type')
        return fetch(`${this.baseUrl}/item/${id}`, { method: 'DELETE', headers: this.headers })
    }
    insert(item) {
        this.headers.set( 'Content-Type', 'application/json' )

        return fetch( this.baseUrl+'/item/', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(item)
        })
    }
    update(item) {
        this.headers.set( 'Content-Type', 'application/json' )

        return fetch(this.baseUrl+'/item/', {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(item)
        })
    }
}