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
        const currentSelection = selections.getSelectionInfo();
    }

    insertString(str) {
        const selection = selections.getSelection();
        const startNode = selection.getRangeAt(0).startContainer, startOffset = selection.getRangeAt(0).startOffset;
        if (selection.toString().length) {
            selection.deleteFromDocument();
        }
        if (startNode.nodeName === '#text') {
            startNode.insertData(startOffset, str);
            this.setCaretPosition(startNode, startOffset + str.length);
        }
    }

    setCaretPosition(node, offset) {
        selections.setSelectionAt({
            startNode: node,
            startOffset: offset,
            endNode: node,
            endOffset: offset
        });
    }
};
