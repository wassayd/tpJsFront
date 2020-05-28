class IndexController extends BaseController {
    constructor() {
        super();
        this.showLists();
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
                        <a class="btn" onclick="indexController.confirmDelete('${list.id}','indexController')"><i class="material-icons">delete</i></a>
                    </td>
                </tr>`;
            }
         }
         console.log(lists)
         $('#lists').innerHTML = content;

    }


}



window.indexController = new IndexController()
