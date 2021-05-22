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
        let selection = this.getSelection();
        let NewRange = document.createRange();
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
        let selection = this.getSelection();
        selection.removeAllRanges();
        let NewRange = document.createRange();
        NewRange.setStart(newNode, offset);
        selection.addRange(NewRange);
    }
    
    setSelectionAt(selectionInfo) {
        let selection = this.getSelection();
        selection.removeAllRanges();
        let NewRange = document.createRange();
        NewRange.setStart(selectionInfo.startNode, selectionInfo.startOffset);
        NewRange.setEnd(selectionInfo.endNode, selectionInfo.endOffset);
        selection.addRange(NewRange);
    }

    getCurrentNodeFromCaretPosition(selectionObj) {
        let selection = selectionObj || this.getSelection();
        if (selection.anchorNode && selection.anchorNode.nodeName === '#text')
            return selection.anchorNode.parentNode;
        else
            return selection.anchorNode;
    }

    getCommonParentFromCurrentSelection() {
        let currentSelection = this.getSelection();
        if (currentSelection) {
            let range = currentSelection.getRangeAt(0);
            return range.commonAncestorContainer;
        }
    }

    getSelectionInfo() {
        let selection = this.getSelection();
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
