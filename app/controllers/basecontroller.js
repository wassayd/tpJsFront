class BaseController {
    constructor() {
        M.AutoInit();
        this.model = new Model()
    }
    displayServiceError() {
        M.toast({html: 'Service injoignable ou problème réseau'})
    }
    getInstance(selector) {
        return M.Modal.getInstance($(selector))
    }
}
