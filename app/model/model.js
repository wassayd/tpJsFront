class Model {
    constructor() {
        // data-oriented service instanciations (ex: API)
        this.listApi = new ListApiService();
        this.itemApi = new ItemsApiService();
    }

    async getAll(){
      try{
          let lists = [];
          for (let list of await this.listApi.getAllList()){
              list.date_achat = new Date(list.date_achat);
              lists.push(Object.assign(new List(),list));
          }
          for (let i =0; i<lists.length; i++){
              lists[i].setItems(await this.getItemsByList(lists[i].id))
          }
          return lists;
      }catch (e) {
          if (e === 404) return null;
          return undefined;
      }
    }

    async getItems(){
        try{
            let items = [];

            for (let item of await this.itemApi.getItems()){
                items.push(Object.assign(new Item(),item))
            }
            return items;
        }catch (e) {
            if (e === 404) return null;
            return undefined;
        }
    }
    async getItemsByList(listId){
       try{
           let items = [];
           for (let item of await this.itemApi.getItemsByListId(listId)){
               items.push(Object.assign(new Item(),item))
           }
           return items;
       }catch (e) {
           if (e === 404) return null;
           return undefined;
       }
    }

    async getListById(id){
        try{
            const list = Object.assign(new List(),(await this.listApi.getListById(id))[0])
            list.date_achat = new Date(list.date_achat);
            list.setItems(await this.getItemsByList(id))
            return list;
        }catch (e) {
            if (e === 404) return null;
            return undefined;
        }
    }

    async getItem(id){
        try{
            let item = Object.assign(new Item(),(await this.itemApi.getItem(id))[0]);

            return item;
        }catch (e) {
            if (e === 404) return null;
            return undefined;
        }
    }

    deleteList(id) {
        return this.listApi.delete(id).then(res => res.status);
    }

    insertList(list) {
        return this.listApi.insert(list).then(res => res.status);
    }

    updateList(list) {
        return this.listApi.update(list).then(res => res.status);
    }

    updateItem(item) {
        return this.itemApi.update(item).then(res => res.status);
    }

    insertItem(item) {
        return this.itemApi.insert(item).then(res => res.status);
    }

    deleteItem(item) {
        return this.itemApi.delete(item).then(res => res.status);
    }

}