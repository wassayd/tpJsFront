class IndexController extends BaseController {
    constructor() {
        super();
        this.showLists();
        this.showsListsShared();

    }
     async showLists(){
         const lists = await  this.model.getAll();
         console.log(lists)
         let content = "";
         for (let list of lists){
            if (list.is_archived === 0 || list.is_archived === null) {
                content += `<tr>
                    <td>${list.shop}</td>
                    <td>${list.date_achat.toLocaleDateString()}</td>
                    <td>${(await this.model.getItemsByList(list.id)).length}</td>
                    <td>
                        <a class="btn" onclick="indexController.edit('${list.id}','showList')"><i class="material-icons">visibility</i> </a>
                        <a class="btn" onclick="indexController.edit('${list.id}','editList')" ><i class="material-icons">edit</i></a>
                        <a class="btn" onclick="indexController.confirmDelete('${list.id}','indexController')"><i class="material-icons">delete</i></a>
                        <a class="btn" onclick="indexController.displayShareModal('${list.id}')"><i class="material-icons">share</i></a>
                    </td>
                </tr>`;
            }
         }
         $('#lists').innerHTML = content;

    }

    async showsListsShared(){
        const listsShared = await this.model.getSharedLists();

        if (listsShared.length >0) {
            $('#tableSharedList').style.display = 'block';
            let content = "";
            for (let listShared of listsShared) {
                console.log(listShared)
                let list = await this.model.getListById(listShared.list_id)
                content += `
                    <tr>
                         <td>${list.shop}</td>
                        <td>${list.date_achat.toLocaleDateString()}</td>
                        <td>${(await this.model.getItemsByList(list.id)).length}</td>
                        <td>${((await this.model.getUserById(list.user_id)).displayName)} - ${((await this.model.getUserById(list.user_id)).login)}</td>
                        <td>
                            ${listShared.is_view ? '   <a class="btn" onclick="indexController.edit(' + list.id + ',\'showList\')"><i class="material-icons">visibility</i> </a>' : ''}
                            
                            ${listShared.is_update ? ' <a class="btn" onclick="indexController.edit(' + list.id + ',\'editList\')"><i class="material-icons">edit</i> </a>' +
                    ' <a class="btn" onclick="indexController.edit(' + list.id + ',\'showList\')"><i class="material-icons">visibility</i> </a>'
                    : ''}
                             <a class="btn" onclick="indexController.confirmDeleteListShared('${listShared.id}')"><i class="material-icons">delete</i></a>
                        </td>
                    </tr>
                `;
            }

            $('#tableSharedList #sharedLists').innerHTML = content;
        }else {
            $('#tableSharedList').style.display = 'none';
        }
    }

}



window.indexController = new IndexController()
