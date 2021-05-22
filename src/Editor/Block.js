import Selection from '../Selection';
const selections = new Selection();

export default class Block {
    constructor (Editor) {
        this.Editor = Editor;
    }

    isABlockNode(node) {
        return node && node.nodeName && node.nodeName.match(/H[1-6]/) || node.nodeName.match(/^(BLOCKQUOTE|DIV|PRE|P|DL|ADDRESS|IMG|LI|TABLE|TR)$/);
    }

    getParentBlockNode(node) {
        let temp = node;
        while (!this.isABlockNode(temp)) {
            temp = temp.parentNode;
        }
        return temp;
    }
    // Note, this code works on assumption that all block nodes are at same level.
    // and they are not lists.
    addBlock(details) {
        let NodeType = details.nodeName;
        let Info = selections.getSelectionInfo();
        let parentStart = Info.startNode, parentEnd = Info.endNode;

        if (parentStart) {
            let tempStartNode = this.getParentBlockNode(parentStart), tempEndNode = this.getParentBlockNode(parentEnd);
            let caretNewNodeStart, caretNewNodeEnd;
            let Node = tempStartNode;
            while (Node && Node != tempEndNode && Node.nodeName == tempStartNode.nodeName) {
                Node = Node.nextSibling;
            }
            if (Node == tempEndNode) {
                if (Node.nodeName == tempStartNode.nodeName) {
                    NodeType = Node.nodeName == NodeType ? "P" : NodeType;
                }
            }
            Node = tempStartNode;
            while (Node && Node != tempEndNode) {
                let nextNode = Node.nextSibling, newNode;
                if (Node.nodeName !== NodeType) {
                    newNode = document.createElement(NodeType);
                    newNode.innerHTML = Node.innerHTML;
                } else {
                    newNode = Node;
                }
                if (Node === tempStartNode) {
                    caretNewNodeStart = this.Editor.getCaretNode(newNode, tempStartNode, parentStart, (parentStart.nodeName == "#text"));
                }
                if (Node.nodeName !== NodeType && Node != newNode) {
                    Node.parentNode.replaceChild(newNode, Node);
                }
                Node = nextNode;
            }
            
            let newNode = document.createElement(NodeType);
            newNode.innerHTML = Node.innerHTML;
            caretNewNodeEnd = this.Editor.getCaretNode(newNode, tempEndNode, parentEnd, (parentEnd.nodeName == "#text"));
            if (!caretNewNodeStart) {
                caretNewNodeStart = this.Editor.getCaretNode(newNode, tempStartNode, parentStart, (parentStart.nodeName == "#text"));
            }
            Node.parentNode.replaceChild(newNode, Node);

            selections.setSelectionAt({
                startNode: caretNewNodeStart || Node,
                startOffset: Info.startOffset,
                endNode: caretNewNodeEnd || Node,
                endOffset: Info.endOffset
            });
        }
    }
};
