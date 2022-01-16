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

    /**
     * @details Insert string in a text node.
     * @param str string to insert.
     */
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

    /**
     * Retrieve all the text nodes.
     * @param startNode 
     * @param endNode 
     * @returns 
     */
     getAllTextNodes(startNode, endNode) {
        const textNodes = startNode === endNode ? [startNode] : [];
        while (startNode !== endNode) {
            while (startNode.nodeName !== '#text') {
                startNode = startNode.childNodes[0];
            }
            textNodes.push(startNode);
            while (startNode !== endNode && startNode !== this.Body && !startNode.nextSibling) {
                startNode = startNode.parentNode;
            }
            if (startNode === endNode || startNode === this.Body) {
                break;
            }
            startNode = startNode.nextSibling;
        }
        return textNodes;
    }

    /**
     * @todo Merge two or more consecutive text nodes into one.
     * @param startNode 
     * @param endNode 
     */
    optimizeNodes(startNode, endNode) {
        
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
