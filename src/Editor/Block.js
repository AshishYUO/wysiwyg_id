import Selection from '../Selection';
import { isABlockNode } from '../Utils';
const selections = new Selection();

export default class Block {
    constructor (Editor) {
        this.Editor = Editor;
    }

    isABlockNode(node) {
        return node && node.nodeName && node.nodeName.match(/H[1-6]/i) || node.nodeName.match(/^(BLOCKQUOTE|DIV|PRE|P|DL|ADDRESS|IMG|LI|TABLE|TR)$/i);
    }

    getParentBlockNode(node) {
        let temp = node;
        while (!this.isABlockNode(temp)) {
            temp = temp.parentNode;
        }
        return temp;
    }

    getAllBlockNodesInCurrentSelection() {
        let currentSelection = selections.getSelectionInfo();
        let { startNode, endNode } = currentSelection;
        let startBlockNode = this.getParentBlockNode(startNode), endBlockNode = this.getParentBlockNode(endNode);
        // Assumption that the nodes are at a same level, and lists are not included.
        let nodeTraversal = startBlockNode, blockNodes = [];
        while (nodeTraversal && nodeTraversal != endBlockNode) {
            blockNodes.push(nodeTraversal);
            nodeTraversal = nodeTraversal.nextSibling;
        }
        if (nodeTraversal) {
            blockNodes.push(nodeTraversal)
        }
        return blockNodes;
    }

    // Note, this code works on assumption that all block nodes are at same level.
    // and they are not lists.
    addBlock(details) {
        let NodeType = details.nodeName;
        let Info = selections.getSelectionInfo();
        let parentStart = Info.startNode, parentEnd = Info.endNode;

        if (parentStart) {
            let blockStartNode = this.getParentBlockNode(parentStart), blockEndNode = this.getParentBlockNode(parentEnd);
            let newStartNode, newEndNode;
            let Node = blockStartNode;
            while (Node && Node != blockEndNode && Node.nodeName == blockStartNode.nodeName) {
                Node = Node.nextSibling;
            }
            if (Node == blockEndNode) {
                if (Node.nodeName == blockStartNode.nodeName) {
                    NodeType = Node.nodeName == NodeType ? "P" : NodeType;
                }
            }
            Node = blockStartNode;
            while (Node && Node != blockEndNode) {
                let nextNode = Node.nextSibling, newNode;
                if (Node.nodeName !== NodeType) {
                    newNode = document.createElement(NodeType);
                    while (Node.childNodes.length > 0) {
                        newNode.appendChild(Node.childNodes[0]);
                    }
                } else {
                    newNode = Node;
                }
                if (Node === blockStartNode) {
                    newStartNode = newNode;
                }
                // maintaining alignment
                if (Node.style && Node.style.textAlign) {
                    newNode.style.textAlign = Node.style.textAlign;
                }
                if (Node.nodeName !== NodeType && Node != newNode) {
                    Node.parentNode.replaceChild(newNode, Node);
                }
                Node = nextNode;
            }
            
            let newNode = document.createElement(NodeType);
            while (Node.childNodes.length > 0) {
                newNode.appendChild(Node.childNodes[0]);
            }
            if (Node.style && Node.style.textAlign) {
                newNode.style.textAlign = Node.style.textAlign;
            }
            if (Node === blockEndNode) {
                newEndNode = newNode;
            }
            if (newStartNode === undefined && blockStartNode == blockEndNode) {
                newStartNode = newEndNode;
            }
            Node.parentNode.replaceChild(newNode, Node);
            // probably at start.
            if (isABlockNode(Info.startNode) && Info.startOffset == 0) {
                Info.startNode = newStartNode;
            }
            if (isABlockNode(Info.endNode) && Info.endOffset == 0) {
                Info.endNode = newEndNode;
            }
            selections.setSelectionAt({
                startNode: Info.startNode,
                startOffset: Info.startOffset,
                endNode: Info.endNode,
                endOffset: Info.endOffset
            });
        }
    }
};
