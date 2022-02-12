
/**
 * @details class for selection
 */
const selection = {
    /**
     * @brief returns the current selection in the document, restricted to editor
     * @returns Selection object
     */
    getSelection: function() {
        return document.getSelection();
    },
    
    /**
     * @brief sets the caret position to the start of given node
     * @param {Element} newNode node at which the caret is to be positioned
     * @returns undefined
     */
    setCaretPositionAtNode: function(newNode) {
        const selection = getSelection();
        const NewRange = document.createRange();
        selection.removeAllRanges();
        NewRange.setStart(newNode, 0);
        selection.addRange(NewRange);
    },

    /**
     * Sets caret position to given node with certain offset
     * @param {Element} newNode given node
     * @param {Number} offset offset
     */
    setCaretPositionAtNodeWithOffset: (newNode, offset) => {
        const selection = getSelection();
        selection.removeAllRanges();
        const NewRange = document.createRange();
        NewRange.setStart(newNode, offset);
        selection.addRange(NewRange);
    },

    /**
     * 
     * @param {HTMLElement} node node element to find it's adjacent element
     * @param {Number} offset Offset between start element and caret position
     * @returns {[HTMLElement, Number]} a new set of TextElement and offset.
     */
    forceTextNodeSelection: (node, offset) => {
        if (node.nodeType === 3 || node.nodeName === 'BR') {
            return [ node, offset ];
        }
        let traverseNode = node;
        while (traverseNode.nodeType !== 3 && traverseNode.nodeName !== 'BR') {
            traverseNode = offset === 1 ? traverseNode.childNodes[traverseNode.childNodes.length - 1] : traverseNode.childNodes[0];
        }
        return [ traverseNode, (traverseNode.nodeType === 3 ? (traverse.textContent.length * offset) : offset) ];
    },

    /**
     * @brief ensure that selection to be text nodes or break lines.
     * @param void
     * @returns None
     */
    ensureCaretSelection: () => {
        const currSelection = selection.getSelectionInfo();
        const {
            startNode,
            endNode,
            startOffset,
            endOffset
        } = currSelection;
        const [ newStartNode, newStartOffset ] = selection.forceTextNodeSelection(startNode, startOffset);
        const [ newEndNode, newEndOffset ] = selection.forceTextNodeSelection(endNode, endOffset);
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
    setSelectionAt: selectionInfo => {
        const currSelection = getSelection();
        currSelection.removeAllRanges();
        const newRange = document.createRange();
        let {
            startNode,
            endNode,
            startOffset,
            endOffset
        } = selectionInfo;
        [ startNode, startOffset ] = selection.forceTextNodeSelection(startNode, startOffset);
        [ endNode, endOffset ] = selection.forceTextNodeSelection(endNode, endOffset);
        newRange.setStart(startNode, startOffset);
        newRange.setEnd(endNode, endOffset);
        currSelection.addRange(newRange);
    },

    /**
     * 
     * @param {*} selectionObj 
     * @returns 
     */
    getCurrentNodeFromCaretPosition: selectionObj => {
        const selection = selectionObj || getSelection();
        if (selection.anchorNode && selection.anchorNode.nodeName === '#text') {
            return selection.anchorNode.parentNode;
        } else {
            return selection.anchorNode;
        }
    },

    getCommonParentFromCurrentSelection: () => {
        const currentSelection = getSelection();
        if (currentSelection) {
            const range = currentSelection.getRangeAt(0);
            return range.commonAncestorContainer;
        }
    },

    /**
     * @details returns the current selection info.
     * @returns {Object} Caret selection: Start node with it's offset,
     * end node with it's offset
     */
    getSelectionInfo: () => {
        const currentSelection = getSelection();
        if (currentSelection) {
            return {
                startNode: currentSelection.getRangeAt(0).startContainer,
                startOffset: currentSelection.getRangeAt(0).startOffset,
                endNode: currentSelection.getRangeAt(0).endContainer,
                endOffset: currentSelection.getRangeAt(0).endOffset
            };
        }
    }
};

export default selection;
