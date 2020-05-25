class EditController extends BaseFormController {
    constructor() {
        super()
        if (indexController.selectedList) {
            self.selectedList = indexController.selectedList
            indexController.selectedList = null;
            let tmp = 0
            self.selectedList.items.filter(item=>{if(item.id > tmp){ tmp = item.id} });

            this.maxId =  tmp === undefined ? 1 : tmp;

            this.deletedItem = null;
            this.showList();
        }
    }
    async showList() {
       self.selectedList.items = await this.model.getItemsByList( self.selectedList.id)
        $('#editTitle').innerText = "Liste des courses " + self.selectedList.shop;
        $("#fieldListShop").value = self.selectedList.shop;
        $("#fieldListDate").value = new Date(self.selectedList.date_achat).toLocaleDateString();
        let content = "";
        for(let item of self.selectedList.items){
            content += `
                <div class="row flipInX animated item" id="item-${item.id}">
                    <div class="input-field col s2" style="display: flex">
                         <p class="left" >
                                  <label>
                                    ${item.is_checked ? 
                                        `<input type="checkbox" id="done-${item.id}"  onclick="editListController.updateCheckedItem(this)" checked>` : 
                                        `<input type="checkbox" id="done-${item.id}"  onclick="editListController.updateCheckedItem(this)" >` }
                                    <span></span>
                                  </label>
                         </p>
                         <input  type="number" value="${item.quantity}" min="1" id="qte-${item.id}">
                    </div>
                    <div class="input-field col s8">
                       <input   type="text" value="${item.label}" id="label-${item.id}">
                    </div>
                    <div class="input-field col s2 " style="margin-top: 30px;">   
                      <a class="btn" onclick="editListController.displayConfirmDelete(${item.id})"><i class="material-icons">delete</i></a>
                    </div>
                </div>
       
            `;
        }


        $('#items').innerHTML = content;
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
        let item       = new Item(label,qte,self.selectedList.id);

        if (await this.model.insertItem(item) === 200){
            this.showList();
        }

        //vide les champs lors de l'insertion de l"article dans la liste des courses
        $('#qte').value    = "";
        $('#label').value  = "";

    }
    async save() {
         this.updateItem();
        let shop       = this.validateRequiredField('#fieldListShop', 'Shop');
        let date_achat = this.validateRequiredField("#fieldListDate", 'Date');

        if ((shop != null) && (date_achat != null)) {
            const date = new Date(date_achat)

            try {
                if (self.selectedList) {
                    self.selectedList.shop = shop;
                    self.selectedList.date_achat = date;

                    if (await this.model.updateList(self.selectedList) === 200) {
                        this.toast("La liste a bien été modifé");
                        self.car = null;
                        navigate('index')
                    } else {
                        this.displayServiceError()
                    }
                }
            } catch (err) {
                console.log(err)
                this.displayServiceError()
            }
        }
    }

   async updateItem(){
        $('.item',async (e)=>{
            let itemId = parseInt(e.id.substring(5));
            let item = await this.model.getItem(itemId);
            item.label    = $(`#label-${itemId}`).value;
            item.quantity = parseInt($(`#qte-${itemId}`).value);
            item.is_checked = $(`#done-${itemId}`).checked
            await this.model.updateItem(item);
        })
       /**/
    }
    async updateCheckedItem(e){
        let itemId = parseInt(e.id.substring(5));
        let item = await this.model.getItem(itemId);
        item.is_checked = e.checked
        await this.model.updateItem(item);
    }
    undoDelete() {
        if (this.deletedItem) {
            this.model.insertItem(this.deletedItem).then(status => {
                if (status == 200) {
                    this.deletedCar = null
                    this.displayUndoDone()
                    this.showList()
                }
            }).catch(_ => this.displayServiceError())
        }
    }
    async displayConfirmDelete(id) {
        try {
            const item = await this.model.getItem(id)
            super.displayConfirmDelete(item, async () => {
                switch (await this.model.deleteItem(id)) {
                    case 200:
                        this.deletedItem = item
                        this.displayDeletedMessage("editListController.undoDelete()");
                        break
                    case 404:
                        this.displayNotFoundError();
                        break
                    default:
                        this.displayServiceError()
                }
                this.showList()
            })
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }
}

window.editListController = new EditController()
