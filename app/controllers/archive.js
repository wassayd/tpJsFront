class Archive extends BaseController{
    constructor() {
        super();
        this.showLists()
    }
    async showLists(){
        const lists = await  this.model.getAll();
        let content = "";
        for (let list of lists){
            if (list.is_archived === 1 ) {
                content += `<tr>
                    <td>${list.shop}</td>
                    <td>${list.date_achat.toLocaleDateString()}</td>
                    <td>${(await this.model.getItemsByList(list.id)).length}</td>
                    <td>
                        <button class="btn" onclick="indexController.edit('${list.id}','showList',true)"><i class="material-icons">visibility</i> </button>
                        <button class="btn" onclick="indexController.displayConfirmDelete('${list.id}')"><i class="material-icons">delete</i></button>
                    </td>
                </tr>`;
            }
        }
        $('#lists').innerHTML = content;

    }
}

window.archiveController = new Archive();