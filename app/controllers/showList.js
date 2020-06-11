class ShowList extends BaseController {
    constructor() {
        super();
        if (indexController.selectedList ) {
            self.selectedList = indexController.selectedList;
            self.isArchiver = indexController.isArchiver;
            indexController.selectedList = null;

            $('#title').innerHTML = self.selectedList.shop + " - " + self.selectedList.date_achat.toLocaleDateString();

        }else if(archiveController.selectedList){
            self.selectedList = archiveController.selectedList;
            self.isArchiver = self.selectedList.is_archived;
            archiveController.selectedList = null;

            $('#title').innerHTML = self.selectedList.shop + " - " + self.selectedList.date_achat.toLocaleDateString();
        }

        this.showList();
    }

    async showList() {
        self.selectedList.items = await this.model.getItemsByList(self.selectedList.id)
        let content = "";
        for (let item of self.selectedList.items) {
            content += `
                <div class="row flipInX animated item" id="item-${item.id}">
                    <div class="input-field col s2" style="display: flex">
                         <p class="left" >
                                  <label>
                                    ${item.is_checked ?
                                        self.isArchiver ? `<input type="checkbox" id="done-${item.id}"  checked disabled>` : `<input type="checkbox" id="done-${item.id}"  onclick="showListController.updateCheckedItem(this)" checked >` :
                                        self.isArchiver ? `<input type="checkbox" id="done-${item.id}"  disabled >` : `<input type="checkbox" id="done-${item.id}"  onclick="showListController.updateCheckedItem(this)" >`
                                    }
                                    <span></span>
                                  </label>
                         </p>
                        <p>${item.quantity}</p>
                    </div>
                    <div class="input-field col s10">
                        <p>${item.label}</p>
                    </div>
         
                </div>
            `;
        }
        if (!self.isArchiver){
            content += '<button class="waves-effect waves-light btn" onclick="showListController.archiver()"><i class="material-icons right">save</i>Archiver</button>'
        }
        $('#items').innerHTML = content;
    }

    async updateCheckedItem(e){
        try{

            let itemId = parseInt(e.id.substring(5));
            let item = await this.model.getItem(itemId);
            item.is_checked = e.checked
            await this.model.updateItem(item);

        }catch (e) {
            console.log(e)
            this.displayServiceError()
        }
    }

    async archiver(){
        let list = await this.model.getListById(self.selectedList.id);
        list.is_archived = true;
        await this.model.updateList(list);
        navigate('index')
    }

}
window.showListController = new ShowList();