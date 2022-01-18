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
     * @details Sets the selection as defined in selectionInfo
     * @param {Object} selectionInfo with start node and offset,
     * endnode and it's offset
     * @returns {void}
     */
    setSelectionAt: selectionInfo => {
        const selection = getSelection();
        selection.removeAllRanges();
        const NewRange = document.createRange();
        NewRange.setStart(selectionInfo.startNode, selectionInfo.startOffset);
        NewRange.setEnd(selectionInfo.endNode, selectionInfo.endOffset);
        selection.addRange(NewRange);
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
        const selection = getSelection();
        if (selection) {
            return {
                startNode: selection.getRangeAt(0).startContainer,
                startOffset: selection.getRangeAt(0).startOffset,
                endNode: selection.getRangeAt(0).endContainer,
                endOffset: selection.getRangeAt(0).endOffset
            };
        }
    }
};

export default selection;
