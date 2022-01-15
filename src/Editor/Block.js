import Selection from '../Selection';
const selections = new Selection();

export default class Block {
    constructor (Editor) {
        this.Editor = Editor;
        this.blockSet = new Set(["H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", "DIV", "PRE", "P", "DL", "ADDRESS", "IMG", "LI", "TABLE", "TR"]);
    }
    /**
     * @details Check to see if a node is a block node or not.
     * @param node node to check
     * @returns true if it's a block node else false
     */
    isABlockNode(node) {
        return this.blockSet.has(node.nodeName);
    }

    /**
     * @details Get parent block node that is just below the main parent node.
     * @param node the node to evaluate it's parent.
     * @returns block node that is just below main text editor.
     */
    getParentBlockNode(node) {
        const { Body } = this.Editor;
        while (node !== Body && node.parentNode !== Body) {
            node = node.parentNode;
        }
        return node;
    }

    /**
     * @details Get block node that are selected.
     * @returns start node and endNode.
     */
    getSelectedBlockNode() {
        const { Body } = this.Editor;
        const selection = selections.getSelectionInfo();
        const startNode = selection.startNode === Body ? Body.children[selection.startOffset] : this.getParentBlockNode(selection.startNode);
        const endNode = selection.endNode === Body ? (Body.children[selection.endOffset] || Body.children[Body.children.length - 1]) : this.getParentBlockNode(selection.endNode);
        return [startNode, endNode];
    }

    /**
     * @details Get all block nodes in the current selection.
     * @returns List of all selected block nodes.
     */
    getAllBlockNodesInCurrentSelection() {
        const [startBlockNode, endBlockNode] = this.getSelectedBlockNode();
        // Assumption that the nodes are at a same level, and lists are not included.
        let nodeTraversal = startBlockNode;
        const blockNodes = [];
        while (nodeTraversal && nodeTraversal !== endBlockNode) {
            blockNodes.push(nodeTraversal);
            nodeTraversal = nodeTraversal.nextSibling;
        }
        if (nodeTraversal) {
            blockNodes.push(nodeTraversal);
        }
        return blockNodes;
    }

    /**
     * @details Get node name of style that is to be applied.
     * @param blockNodes list of all block nodes.
     * @param nodeName name of node to check
     * @returns true if all blockNodes has the same name
     */
    isEachNodeSame(blockNodes, nodeName) {
        return blockNodes.every(node => node.nodeName === nodeName);
    }
    /**
     * @details Apply node element to selected block elements.
     * @param blockNodes list of all block nodes.
     * @param nodeName node to apply.
     * @returns void, but applies node changes to all selected
     * elements.
     */
    applyBlockNodes(blockNodes, nodeName) {
        blockNodes.forEach((node, index, blockNodes) => {
            if (node.nodeName !== nodeName) {
                const blockElement = document.createElement(nodeName);
                while (node.childNodes.length) {
                    blockElement.appendChild(node.childNodes[0]);
                }
                node.parentNode.replaceChild(blockElement, node);
                blockNodes[index] = blockElement;
            }
        });
    }

    /**
     * @details Return nodes for setting caret.
     * @param blockNode name of the block node.
     * @param node previous node.
     * @param offset offset of the selected node.
     * @returns The selection of the node and it's offset.
     */
    setNodes (blockNode, node, offset) {
        const { Body } = this.Editor;
        if (node === Body) {
            return [ Body, offset ];
        } else if(!node.parentNode) {
            return [ blockNode, offset ];
        } else {
            return [ node, offset ];
        }
    }

    /**
     * @details Set caret position.
     * @param blockNodes list of all block nodes.
     * @param selectionInfo caret selection
     * @return new selection based on applied block information.
     */
    setCaretSelection (blockNodes, selectionInfo) {
        const { startNode, startOffset, endNode, endOffset } = selectionInfo;
        const [ newStNode, newStOffset ] = this.setNodes(blockNodes[0], startNode, startOffset);
        const [ newEndNode, newEndOffset ] = this.setNodes(blockNodes[blockNodes.length - 1], endNode, endOffset);
        return {
            startNode: newStNode,
            endNode: newEndNode,
            startOffset: newStOffset,
            endOffset: newEndOffset
        };
    }

    /**
     * @details Apply style (header or block quote) to the selected text.
     * @param details containing node name.
     * @returns void but applies the node to selected block nodes.
     */
    addBlock(details) {
        const nodeType = details.nodeName;
        const Info = selections.getSelectionInfo();
        const parentStart = Info.startNode, parentEnd = Info.endNode;
        if (parentStart && parentEnd) {
            const blockNodes = this.getAllBlockNodesInCurrentSelection();
            const nodeName = this.isEachNodeSame(blockNodes, nodeType) ? 'P' : nodeType;   
            this.applyBlockNodes(blockNodes, nodeName);
            selections.setSelectionAt(this.setCaretSelection(blockNodes, Info));
        }
    }
};
