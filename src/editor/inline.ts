import selection from '../selection';

/**
 * @details Insert string in a text node.
 * @param {HTMLElement} editor main editor element
 * @param {String} str string to insert.
 * @returns void
 */
function insertString(editor: HTMLElement, str: string) {
    const selections = selection.sel().get();
    const startNode = selections.getRangeAt(0).startContainer, startOffset = selections.getRangeAt(0).startOffset;
    if (selections.toString().length) {
        selections.deleteFromDocument();
    }
    const [selectedNode, selectedOffset] = selection.forceTextNodeSelection(startNode, startOffset);
    if (selectedNode.nodeType === 1) {
        const textNode = document.createTextNode(str),
              textOffset = str.length;
        if (selectedOffset === 1) {
            if (selectedNode.nextSibling) {
                selectedNode.parentNode.insertBefore(textNode, selectedNode.nextSibling);
            } else {
                selectedNode.parentNode.appendChild(textNode);
            }
        } else {
            selectedNode.parentNode.insertBefore(textNode, selectedNode);
        }
        selection.setSelectionAt({
            startNode: textNode,
            startOffset: textOffset,
            endNode: textNode,
            endOffset: textOffset
        });
    } else {
        // selectedNode.insertData(selectedOffset, str);
        selection.setSelectionAt({
            startNode: selectedNode,
            startOffset: selectedOffset + str.length,
            endNode: selectedNode,
            endOffset: selectedOffset + str.length
        });
    }
}

/**
 * Retrieve all the text nodes.
 * @param startNode starting node of selection
 * @param endNode ending node of selection
 * @returns all text nodes that are currently selected
 */
function getAllTextNodes(editor: Node, startNode: Node, endNode: Node) {
    const textNodes = startNode === endNode ? [startNode] : [];

    while (startNode !== endNode && startNode !== editor) {
        // Get leaf node (text node)
        while (startNode.nodeName !== '#text' && startNode.nodeName !== 'BR') {
            startNode = startNode.childNodes[0];
        }
        textNodes.push(startNode);
        // Get parent node till there is no next sibling.
        while (startNode && startNode !== endNode && startNode !== editor && !startNode.nextSibling) {
            startNode = startNode.parentNode;
        }
        if (startNode === endNode || startNode === editor) {
            break;
        }
        startNode = startNode.nextSibling;
    }
    if (textNodes[textNodes.length - 1] !== endNode) {
        textNodes.push(endNode);
    }
    return textNodes;
}

const applyInlineTemp = (editor: Node, details: any) => {
    const { cmd, valArg } = details;
    document.execCommand(cmd, false, valArg);
}

export {
    insertString,
    getAllTextNodes,
    applyInlineTemp
};
