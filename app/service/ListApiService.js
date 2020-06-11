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

    getListSharedByListAndUser(userId,listId){
        return fetchJSON(this.baseUrl+'/list/shared/'+userId+'/'+listId,this.token)
    }

    getAllSharedLists(){
        return fetchJSON(this.baseUrl+"/lists/shared",this.token);
    }

    insertSharedList(listShared){
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch( this.baseUrl+'/list/shared', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(listShared)
        })
    }

    deleteListShared(id) {
        this.headers.delete('Content-Type')
        return fetch(`${ this.baseUrl}/list/shared/${id}`, { method: 'DELETE', headers: this.headers})
    }

    getListSharedByid(id){
        return fetchJSON(this.baseUrl+'/list/shared/'+id,this.token)
    }
}