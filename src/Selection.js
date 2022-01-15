/**
 * @details class for selection
 */
export default class Selection {
    constructor() {
        if (!!Selection.instance) {
            return Selection.instance;
        }
        Selection.instance = this;  
        return this;
    }
    /**
     * @brief returns the current selection in the document, restricted to editor
     * @returns Selection object
     */
    getSelection () {
        return document.getSelection();
    }
    
    /**
     * @brief sets the caret position to the start of given node
     * @param {*} newNode node at which the caret is to be positioned
     * @returns undefined
     */
    setCaretPositionAtNode(newNode) {
        const selection = this.getSelection();
        const NewRange = document.createRange();
        selection.removeAllRanges();
        NewRange.setStart(newNode, 0);
        selection.addRange(NewRange);
    }

    /**
     * Sets caret position to given node with certain offset
     * @param {*} newNode given node
     * @param {*} offset 
     */
    setCaretPositionAtNodeWithOffset(newNode, offset) {
        const selection = this.getSelection();
        selection.removeAllRanges();
        const NewRange = document.createRange();
        NewRange.setStart(newNode, offset);
        selection.addRange(NewRange);
    }
    
    setSelectionAt(selectionInfo) {
        const selection = this.getSelection();
        selection.removeAllRanges();
        const NewRange = document.createRange();
        NewRange.setStart(selectionInfo.startNode, selectionInfo.startOffset);
        NewRange.setEnd(selectionInfo.endNode, selectionInfo.endOffset);
        selection.addRange(NewRange);
    }

    getCurrentNodeFromCaretPosition(selectionObj) {
        const selection = selectionObj || this.getSelection();
        if (selection.anchorNode && selection.anchorNode.nodeName === '#text') {
            return selection.anchorNode.parentNode;
        } else {
            return selection.anchorNode;
        }
    }

    getCommonParentFromCurrentSelection() {
        const currentSelection = this.getSelection();
        if (currentSelection) {
            const range = currentSelection.getRangeAt(0);
            return range.commonAncestorContainer;
        }
    }

    getSelectionInfo() {
        const selection = this.getSelection();
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
