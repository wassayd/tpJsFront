class BaseController {
    constructor() {
        M.AutoInit();
        this.setBackButtonView('index')
        this.model = new Model()
    }
    toast(msg) {
        M.toast({html: msg, classes: 'rounded'})
    }
    displayServiceError() {
        this.toast('Service injoignable ou problème réseau')
    }
    getInstance(selector) {
        return M.Modal.getInstance($(selector))
    }
    setBackButtonView(view) {
        window.onpopstate = function() {
            navigate(view)
        }; history.pushState({}, '');
    }
}
