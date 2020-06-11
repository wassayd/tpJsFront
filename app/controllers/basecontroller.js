class BaseController {
    constructor() {
        M.AutoInit();
        this.setBackButtonView('index')
        this.model = new Model()
        this.deletedList = null;
        this.selectedList = null;
        this.listSharedDeleted  = null;
        this.datePicker();
    }
    toast(msg) {
        M.toast({html: msg, classes: 'rounded'})
    }
    displayConfirmDelete(object, onclick) {
        if (object === undefined) {
            this.displayServiceError()
            return
        }
        if (object === null) {
            this.displayNotFoundError()
            return
        }
        $('#spanDeleteObject').innerText = object.toString()
        $('#btnDelete').onclick = onclick
        this.getModal('#modalConfirmDelete').open()
    }
    async displayShareModal(listId){
        this.getModal('#modalShare').open();
        const list  = await this.model.getListById(listId);
        $('#text-error').style.display = 'none';

        $('#searchUserBtn').onclick = async _=>{
            if(sessionStorage.getItem('login') ===  $('#searchUserInput').value ){
                this.errorMsgModal("Vous ne pouvez pas partager une liste avec vous même !")
                return ;
            }
            try {
                let user =  await this.model.getUser( $('#searchUserInput').value);
                $("#userFinded").style.display = "block";
                $("#displayName").innerText    = user.displayName;
                $("#shareList").onclick = ()=>{this.shareList(list,$('#radioLecture').checked,$('#radioModify').checked,user.id,listId)} ;

            }catch (e) {
                this.errorMsgModal();
            }
        };

    }
    errorMsgModal(text){
        if (text !== undefined) {
            $('#text-error').innerText = text;
        }
        $("#userFinded").style.display = "none";
        $('#text-error').style.display = 'block';
        $('#text-error').style.opacity = '1';
        setTimeout(function () {
            $('#text-error').style.opacity = '0';
            $('#text-error').style.transition = 'all 1.6s';
            $('#text-error').style.display = 'none';
        },1500);
    }

    async shareList(list,readOnly,modifyOnly,userId,listId){
        let listShared = new ListShared(readOnly,modifyOnly,userId,listId);
        if ((await this.model.getListSharedByListAndUser(userId,listId)).length > 0){
            this.toast("La list a deja etais partagé pour cet utilisateur ");
            return
        }
        if (await this.model.insertListShared(listShared) === 200){
            this.toast("List partager avec succés ")
        }else{
            this.displayServiceError()
        }
    }

    displayServiceError() {
        this.toast('Service injoignable ou problème réseau')
    }
    displayNotFoundError() {
        this.toast('Entité inexistante')
    }
    displayDeletedMessage(onUndo) {
        this.toast( `<span>Supression effectuée</span><button class="btn-flat toast-action" onclick="${onUndo}">Annuler</button>`)
    }
    displayUndoDone() {
        this.toast('Opération annulée')
    }
    getModal(selector) {
        return M.Modal.getInstance($(selector))
    }
    setBackButtonView(view) {
        window.onpopstate = function() {
            navigate(view)
        }; history.pushState({}, '');
    }

    datePicker(){
        const Calender = document.querySelector('.datepicker');
        M.Datepicker.init(Calender, {
            format: 'dd/mm/yyyy',
            autoClose: true,
            showClearBtn: true,
            i18n: {
                done: "",
                clear: "supprimer",
                cancel: "retour",
                months: ['Janvier',
                    'Février',
                    'Mars',
                    'Avril',
                    'Mai',
                    'Juin',
                    'Juillet',
                    'Août',
                    'Septemb.',
                    'Octob.',
                    'Novemb.',
                    'Décemb.'],
                weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
                weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Dec']
            }
        });
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

            this.selectedList = list;
            navigate(controller)
        }catch (e) {
            console.log(e)
        }

    }

    undoDelete(controller) {
        if (this.deletedList) {
            this.deletedList.date_achat = this.deletedList.date_achat.toISOString().slice(0, 19).replace('T', ' ');
            if (controller.constructor.name === "Archive"){
                this.deletedList.is_archived = true
            }
            this.model.insertList(this.deletedList).then(status => {
                console.log("status",status)
                if (status == 200) {
                    this.deletedList = null;
                    this.displayUndoDone();
                    this.showLists();
                }else{
                    super.toast("Impossible d'annuler la suppresion erreur "+status+" serveur")
                }
            }).catch(_ => this.displayServiceError())
        }
    }

    undoDeleteListShared(){
        if (this.listSharedDeleted){
            this.model.insertListShared(this.listSharedDeleted)
                .then(status =>{
                    if (status === 200){
                        this.listSharedDeleted =null;
                        this.displayUndoDone();
                        this.showsListsShared();
                    }else{
                        super.toast("Impossible d'annuler la suppresion erreur "+status+" serveur")
                    }
                })
        }
    }
    async confirmDelete(id,controller) {
        try {
            const list = await this.model.getListById(id);
            this.displayConfirmDelete(list, async () => {
                switch (await this.model.deleteList(id)) {
                    case 200:
                        this.deletedList = list;
                        this.displayDeletedMessage(controller+".undoDelete("+controller+")");
                        this.showLists();
                        break;
                    case 404:
                        this.displayNotFoundError();
                        break;
                    default:
                        this.displayServiceError()
                }
            })
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async confirmDeleteListShared(listId){
        try {
            const listShared = (await this.model.getListSharedByid(listId));
            console.log(listShared)
            this.displayConfirmDelete(listShared, async () => {
                switch (await this.model.deleteListShared(listId)) {
                    case 200:
                        this.listSharedDeleted = listShared;
                        console.log(listShared)
                        this.displayDeletedMessage("indexController.undoDeleteListShared()");
                        this.showsListsShared();
                        break;
                    case 404:
                        this.displayNotFoundError();
                        break;
                    default:
                        this.displayServiceError()
                }
            })
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }
}
