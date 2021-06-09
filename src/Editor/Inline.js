import Selection from '../Selection';
const selections = new Selection();

export default class Inline {
    constructor (Editor) {
        this.Editor = Editor;
    }

    getAllInlineNodes(node) {
        return node.nodeName.match(/^(SPAN|B|STRONG|I|EM|U|SUB|SUP|CODE)$/i);
    }

    getAllInlineNodesInCurrentSelection() {
        let currentSelection = selections.getSelectionInfo();
    }

};
