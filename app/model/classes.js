// Business classes definitions
class List {
    constructor(shop,date) {
        this.shop     = shop;
        this.date_achat     = date;
        this.is_archived = false;
        this.items    = [];
    }

    setItems (items){
        this.items = items;
    }

    addItem(item){
        this.items.push(item);
    }
    toString(){
        return ` ${this.shop} - ${this.date_achat.toLocaleString().substring(0,10)} `
    }
}

class Item {
    constructor(id,label,quantity,checked,listId=null) {
        this.id = id;
        this.label    = label;
        this.quantity = quantity;
        this.is_checked  = checked;
        this.list_id     = listId
    }
    toString(){
        return ` label : ${this.label} qte : ${this.quantity} `
    }

}

class ListShared {

    constructor(is_view,is_update,user_id,list_id) {
        this.is_view    = is_view;
        this.is_update  = is_update;
        this.user_id    = user_id;
        this.list_id    = list_id;
    }
    toString(){
        return `List id ${this.list_id} User id ${this.user_id}`;
    }
}

class User {
    constructor(id,displayName,login,password) {
        this.id          = id;
        this.displayName = displayName;
        this.login       = login;
        this.password    = password;

    }

    toString(){
        return `Pseudo ${this.displayName} Email ${this.login}`;
    }
}