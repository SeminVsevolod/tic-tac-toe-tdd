class DomController {
    constructor(root) {
        this.rootNode = document.querySelector(root);
    }

    createTable(rows = 0, cols = 0) {
        const child = document.createElement('table');
        this.rootNode.appendChild(child);

        const table = this.rootNode.querySelector('table');

        for (let i = 0; i < rows; i++) {
            const row = table.insertRow(i);

            for (let j = 0; j < cols; j++) {
                const cell = row.insertCell(j);
            }
        }
    }
}

export default DomController;