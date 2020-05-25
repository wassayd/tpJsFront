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
    constructor(label,quantity,listId=null) {
        this.label    = label;
        this.quantity = quantity;
        this.is_checked  = false;
        this.list_id     = listId
    }
    toString(){
        return ` label : ${this.label} qte : ${this.quantity} `
    }

}