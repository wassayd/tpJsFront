class BaseController {
    constructor() {
        M.AutoInit();
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
}
