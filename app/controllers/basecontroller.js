class BaseController {
    constructor() {
        M.AutoInit();
        this.setBackButtonView('index')
        this.model = new Model()
        this.deletedList = null;
        this.selectedList = null;
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
                console.log("apres",this.deletedList)
            }
            this.model.insertList(this.deletedList).then(status => {
                console.log("status",status)
                if (status == 200) {
                    console.log("qsdqsdqsdqdq",this.deletedList)
                    this.deletedList = null;
                    this.displayUndoDone();
                    this.showLists();
                }else{
                    super.toast("Impossible d'annuler la suppresion erreur "+status+" serveur")
                }
            }).catch(_ => this.displayServiceError())
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
}
