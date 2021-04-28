/**
 * @details class for selection
 */
class Selection {
    constructor() {
        if (!!Selection.instance) {
            return Selection.instance;
        }
        Selection.instance = this;  
        return this;
    }

    getSelection () {
        return document.getSelection();
    }
    
    setCaretPositionAtNode(newNode) {
        let selection = this.getSelection();
        let NewRange = document.createRange();
        selection.removeAllRanges();
        NewRange.setStart(newNode, 0);
        selection.addRange(NewRange);
    }

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
        NewRange.setEnd(selectionInfo.endNode, selectionInfo.endOffset);
        NewRange.setStart(selectionInfo.startNode, selectionInfo.startOffset);
        selection.addRange(NewRange);
    }

    getCurrentNodeFromCaretPosition(selectionObj) {
        let selection = selectionObj || this.getSelection();
        if (selection.anchorNode && selection.anchorNode.nodeName === '#text')
            return selection.anchorNode.parentNode;
        else
            return selection.anchorNode;
    }

    getSelectionInfo() {
        let selection = this.getSelection();
        return {
            startNode: selection.anchorNode,
            startOffset: selection.anchorOffset,
            endNode: selection.focusNode,
            endOffset: selection.focusOffset
        };
    }
};
