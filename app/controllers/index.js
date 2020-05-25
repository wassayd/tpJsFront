class IndexController extends BaseController {
    constructor() {
        super();
        this.showLists();
        this.deletedList = null;
    }
     async showLists(){
         const lists = await  this.model.getAll();

         let content = "";
         for (let list of lists){
            if (list.is_archived === 0 ) {
                content += `<tr>
                    <td>${list.shop}</td>
                    <td>${list.date_achat.toLocaleDateString()}</td>
                    <td>${(await this.model.getItemsByList(list.id)).length}</td>
                    <td>
                        <a class="btn" onclick="indexController.edit('${list.id}','showList')"><i class="material-icons">visibility</i> </a>
                        <a class="btn" onclick="indexController.edit('${list.id}','editList')" ><i class="material-icons">edit</i></a>
                        <a class="btn" onclick="indexController.displayConfirmDelete('${list.id}')"><i class="material-icons">delete</i></a>
                    </td>
                </tr>`;
            }
         }
         $('#lists').innerHTML = content;

    }
    async edit(listId,controller,isArchiver=false){
        try {
            const list = (await this.model.getListById(listId))
            if (list === undefined) {
                this.displayServiceError();
                return
            }
            if (list === null) {
                this.displayNotFoundError();
                return
            }
            console.log(list)
            this.selectedList = list;
            this.isArchiver   = isArchiver;
            navigate(controller)
        }catch (e) {
            console.log(e)
        }

    }

    undoDelete() {
        if (this.deletedList) {
            this.model.insertItem(this.deletedList).then(status => {
                if (status == 200) {
                    this.deletedList = null;
                    this.displayUndoDone();
                    this.showLists();
                }
            }).catch(_ => this.displayServiceError())
        }
    }
    async displayConfirmDelete(id) {
        try {
            const list = await this.model.getListById(id);
            super.displayConfirmDelete(list, async () => {
                switch (await this.model.deleteList(id)) {
                    case 200:
                        this.deletedList = list;
                        this.displayDeletedMessage("indexController.undoDelete()");
                        break;
                    case 404:
                        this.displayNotFoundError();
                        break;
                    default:
                        this.displayServiceError()
                }
                this.showLists()
            })
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

}



window.indexController = new IndexController()
