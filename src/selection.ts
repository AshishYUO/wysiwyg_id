import { Option, Some } from "utils/option";

/**
 * @details class for selection
 */
const selection = {
    /**
     * @brief Returns the current selection in the document, restricted to editor
     * @returns Selection object
     */
    sel: () => Some(document.getSelection()),
    
    /**
     * @brief sets the caret position to the start of given node
     * @param {Element} newNode node at which the caret is to be positioned
     * @returns undefined
     */
    setCaretPositionAtNode: function(newNode: Node) {
        selection.sel().do(select => {
            const NewRange = document.createRange();
            select.removeAllRanges();
            NewRange.setStart(newNode, 0);
            select.addRange(NewRange);
        });
    },

    /**
     * Sets caret position to given node with certain offset
     * @param {Element} newNode given node
     * @param {Number} offset offset
     */
    setCaretPositionAtNodeWithOffset: (
        newNode: Node,
        offset: number
    ) => {
        selection.sel().do(select => {
            select.removeAllRanges();
            const NewRange = document.createRange();
            NewRange.setStart(newNode, offset);
            select.addRange(NewRange);
        });
    },

    /**
     * 
     * @param {HTMLElement} node node element to find it's adjacent element
     * @param {Number} offset Offset between start element and caret position
     * @returns {[HTMLElement, Number]} a new set of TextElement and offset.
     */
    forceTextNodeSelection: (
        node: Node, 
        offset: number
    ): [Node, number] => {
        if (node.nodeType === 3 || node.nodeName === 'BR') {
            return [node, offset];
        }
        let traverseNode = node;
        while (traverseNode.nodeType !== 3 && traverseNode.nodeName !== 'BR') {
            traverseNode = offset === 1 ? traverseNode.childNodes[traverseNode.childNodes.length - 1] : traverseNode.childNodes[0];
        }
        return [
            traverseNode,
            (traverseNode.nodeType === 3 ? (traverseNode.textContent.length * offset) : offset)
        ];
    },

    /**
     * @brief ensure that selection to be text nodes or break lines.
     * @param void
     * @returns None
     */
    ensureCaretSelection: (): void => {
        const currSelection = selection.getSelectionInfo().get();
        const {
            startNode,
            endNode,
            startOffset,
            endOffset
        } = currSelection;
        
        const [
            newStartNode, 
            newStartOffset
        ] = selection.forceTextNodeSelection(startNode, startOffset);
        const [
            newEndNode,
            newEndOffset
        ] = selection.forceTextNodeSelection(endNode, endOffset);

        selection.setSelectionAt({
            startNode: newStartNode,
            endNode: newEndNode,
            startOffset: newStartOffset,
            endOffset: newEndOffset
        });
    },

    /**
     * @details Sets the selection as defined in selectionInfo
     * @param {Object} selectionInfo with start node and offset,
     * endnode and it's offset
     * @returns {void}
     */
    setSelectionAt: (selectionInfo: SelectionInfo): void => {
        selection.sel().do(currSel => {
            currSel.removeAllRanges();
            const newRange = document.createRange();

            let {
                startNode,
                endNode,
                startOffset,
                endOffset
            } = selectionInfo;

            newRange.setStart(startNode, startOffset);
            newRange.setEnd(endNode, endOffset);
            currSel.addRange(newRange);
        });
    },

    /**
     * 
     * @param {*} selectionObj 
     * @returns 
     */
    getCurrentNodeFromCaretPosition: (sel: Selection = undefined): Option<Node> => {
        return selection.sel().map(currSel => {
            switch (currSel.anchorNode?.nodeType) {
                case 3:  return currSel.anchorNode.parentNode;
                default: return currSel.anchorNode;
            }
        });
    },

    getCommonParentFromCurrentSelection: (): Option<Node> => {
        return selection.sel().map(curSel => (
            curSel.getRangeAt(0).commonAncestorContainer
        ))
    },

    /**
     * @details returns the current selection info.
     * @returns {Object} Caret selection: Start node with it's offset,
     * end node with it's offset
     */
    getSelectionInfo: (): Option<SelectionInfo> => {
        return selection.sel().map(currSel => ({
            startNode: currSel.getRangeAt(0).startContainer,
            startOffset: currSel.getRangeAt(0).startOffset,
            endNode: currSel.getRangeAt(0).endContainer,
            endOffset: currSel.getRangeAt(0).endOffset
        }));
    }
};

export interface SelectionInfo {
    startNode: Node;
    endNode: Node;
    startOffset: number;
    endOffset: number;
};

export default selection;
