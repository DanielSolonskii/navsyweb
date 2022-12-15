export default {
    methods: {
        infoMsg(text) {
            const msg = {
                text: text,
                variant: 'info',
                title: 'Information',
                iconClass: 'cil-info',
                textClass: 'text-info'
            }
            this.renderMsg(msg)
        },
        successMsg(text) {
            const msg = {
                text: text,
                variant: 'success',
                title: 'Success',
                iconClass: 'cil-check-circle',
                textClass: 'text-success'
            }
            this.renderMsg(msg)
        },
        warningMsg(text) {
            const msg = {
                text: text,
                variant: 'warning',
                title: 'Warning',
                iconClass: 'cil-warning',
                textClass: 'text-warning'
            }
            this.renderMsg(msg)
        },
        errorMsg(text) {
            const msg = {
                text: text,
                variant: 'danger',
                title: 'Error',
                iconClass: 'cil-x-circle',
                textClass: 'text-danger'
            }
            this.renderMsg(msg)
        },
        renderMsg(msg) {
            console.log(msg)
        }
    }
}