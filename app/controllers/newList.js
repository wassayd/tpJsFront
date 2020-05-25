class NewList extends  BaseFormController{
   constructor() {
        super();
        this.items = [];
        this.itemid =1;
    }



   async addItem(){
        let qte           = $('#qte').value;
        let label         = $('#label').value;

        if (qte === '' || qte === undefined){
            this.toast('Veuillez saisir une quantité');
            $('#qte').parentNode.classList.toggle("shake");
            $('#qte').parentNode.classList.toggle("animated");
            return;
        }

        if (label === '' || label === undefined){
            this.toast("Veuillez saisir le nom de l'article");
            $('#label').parentNode.classList.toggle("shake");
            $('#label').parentNode.classList.toggle("animated");
            return;
        }
        let item       = new Item(label,qte);
        this.items.push(item);

       let  content = `
            <div class="row flipInX animated item" id="item-${this.itemid}">
                <div class="input-field col s2" style="display: flex">
                     <p class="left" >
                          <label>
                            ${item.is_checked ?
                               `<input type="checkbox" id="${this.itemid}"  checked>` :
                               `<input type="checkbox" id="${this.itemid}"   >` 
                            }
                            <span></span>
                          </label>
                     </p>
                     <p>${item.quantity}</p>
                </div>
                <div class="input-field col s8">
                   <p>${item.label}</p>
                </div>
                <div class="input-field col s2 " style="margin-top: 30px;">   
                  <a class="btn" onclick=""><i class="material-icons">delete</i></a>
                </div>
            </div>
   
        `;

       $('#items').insertAdjacentHTML('afterend',content);
       this.itemid++;
        //vide les champs lors de l'insertion de l"article dans la liste des courses
        $('#qte').value    = "";
        $('#label').value  = "";
    }

    async save(){
        let shop       = this.validateRequiredField('#fieldListShop', 'Shop');
        let date_achat = this.validateRequiredField("#fieldListDate", 'Date');

        if ((shop != null) && (date_achat != null)) {
            //je convertis la date au format mm/dd/yyy
            //je rajoute +1 au jour car vue que la date est minuit il me prend le jour d'avant ex: 24/12/2019 il prendra 23/12/2019 d'ou le +1 pour eviter ca
            date_achat = `${date_achat.slice(3,-5)}/${parseInt(date_achat.slice(0,2))+1}/${date_achat.slice(6)}`;
            let date = new Date(date_achat);
            date = date.toISOString().slice(0, 19).replace('T', ' ');

            const list = new List(shop,date);
            try {
                if (await this.model.insertList(list) === 200) {
                    this.toast("La liste a bien été créer");
                    let list  = await this.model.getAll();
                    for (let item of this.items){
                        item.list_id = list[list.length-1].id
                        await this.model.insertItem(item)
                    }
                    navigate('index')
                } else {
                    this.displayServiceError()
                }
            } catch (err) {
                console.log(err)
                this.displayServiceError()
            }

        }
    }
}
window.newListController = new NewList();