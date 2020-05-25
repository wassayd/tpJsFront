class BaseController {
    constructor() {
        M.AutoInit();
        this.setBackButtonView('index')
        this.model = new Model()
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
}
