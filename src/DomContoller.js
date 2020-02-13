class DomController {
    constructor(root) {
        this.rootNode = document.querySelector(root);
    }

    createTable() {
        const child = document.createElement('table');
        this.rootNode.appendChild(child);
    }
}