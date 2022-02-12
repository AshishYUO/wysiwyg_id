import {
    getParentBlockNode,
    isABlockNode
} from "./Editor/Block";
import selection from "./Selection";

const availableFormats = new Set([ 'B', 'I', 'U', 'SUB', 'SUP', 'H1', 'H2', 'BLOCKQUOTE', 'A', 'OL', 'UL' ]);

/**
 * @details Get intersection of setA and setB
 * @param setA 
 * @param setB 
 */
const intersection = (setA, setB) => {
    const toRemove = []
    setA.forEach(element => {
        if (!setB.has(element)) {
            toRemove.push(element);
        }
    })
    toRemove.forEach(element => setA.delete(element));
}

const removeSelectedText = (editor) => {
    const currSelection = selection.getSelection();
    if (currSelection) {
        const str = currSelection.toString();
        if (str && str.length) {
            currSelection.deleteFromDocument();
        }
    }
}

/**
 * @details Get all common intersecting styles applied to the selection
 * @param allTextNodes list of text nodes
 * @param body editor body.
 * @returns set of all styles applied.
 */
const getIntersectingFormattingOptions = (body, allTextNodes) => {
    let align = false;
    const formatApplied = new Set([...availableFormats]);
    for (const node of allTextNodes) {
        align = align !== undefined ? false : align;
        const currentFormat = new Set();
        let traverse = node;
        for (;traverse !== body; traverse = traverse.parentNode) {
            if (formatApplied.has(traverse.nodeName)) {
                currentFormat.add(traverse.nodeName);
            }
            align = (traverse.style && traverse.style.textAlign) ? traverse.style.textAlign : align;
        }
        intersection(formatApplied, currentFormat);
        align = !align ? undefined : align;
        if (!formatApplied.size) {
            break;
        }
    }
    return [ formatApplied, align ];
}

/**
 * @details Get applied style on a particular text node.
 * @param editor main editor node to work on.
 * @param node Node element to evaluate it's style.
 */
 const getAppliedStyles = (editor, node) => {
    const styles = [];
    while (node !== editor) {
        if (availableFormats.has(node.nodeName)) {
            styles.push(node.nodeName);
        }
        node = node.parentNode;
    }
    return styles;
}


/**
 * @details Apply node element to selected block elements.
 * @param blockNodes list of all block nodes.
 * @param nodeName node to apply.
 * @returns void, but applies node changes to all selected
 * elements.
 */
 const applyBlockNodes = (blockNodes, nodeName) => {
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
 * 
 * @param {HTMLElement} editor 
 */
const selectAll = (editor) => {;
    let startNode = editor.childNodes[0], endNode = editor.childNodes[editor.childNodes.length - 1];
    while (startNode.childNodes && startNode.childNodes.length) {
        startNode = startNode.childNodes[0];
    }
    while (endNode.childNodes && endNode.childNodes.length) {
        endNode = endNode.childNodes[endNode.childNodes.length - 1];
    }
    selection.setSelectionAt({
        startNode: startNode,
        endNode: endNode,
        startOffset: 0,
        endOffset: endNode.textContent.length
    });
}

const assertBrOnEmptyBlockNode = (editor, removeOnCall) => {
    let {
        startNode,
        endNode,
        startOffset,
        endOffset
    } = selection.getSelectionInfo();
    const parentBlockNode = getParentBlockNode(editor, startNode, startOffset);
    if (!parentBlockNode.childNodes.length && parentBlockNode.nodeType === 1) {
        if (parentBlockNode.nodeName === 'BR') {
            const par = document.createElement('P');
            const breakNode = document.createElement('BR')
            par.appendChild(breakNode);
            parentBlockNode.parentNode.replaceChild(par, parentBlockNode);
            selection.setSelectionAt({
                startNode: breakNode,
                endNode: breakNode,
                startOffset: 0,
                endOffset: 0
            });
        } else {
            parentBlockNode.appendChild(document.createElement('BR'));
        }
    } else {
        const breakNodeCheck = parentBlockNode.childNodes[parentBlockNode.childNodes.length - 1];
        if (removeOnCall && breakNodeCheck.nodeName === 'BR') {
            breakNodeCheck.remove();
        }
    }
}

const onEnterPressed = editor => {
    removeSelectedText(editor);
    const currSelection = selection.getSelection();
}

/**
 * @details Insert break line: A part of Shift + Enter key functionality.
 * @param {HTMLElement} editor main editor node.
 * @returns void.
 */
const breakLine = (editor) => {
    removeSelectedText(editor);
    // currSelection, startNode and endNode and their offsets are same
    const currSelection = selection.getSelectionInfo();
    if (currSelection) {
        const [ startNode, startOffset ] = selection.forceTextNodeSelection(currSelection.startNode, currSelection.startOffset);
        // ensure the selection is of type text node.
        const breakLineElement = document.createElement('BR');
        if (startNode.nodeType === 1) {
            // perform some action
            if (startOffset === 1) {
                if (startNode.nextSibling) {
                    startNode.parentNode.appendChild(breakLineElement);
                } else {
                    startNode.parentNode.insertBefore(breakLineElement, startNode);
                }
                // todo: To make selection just after the break line element.
            }
        } else {
            if (startOffset > 0 && startOffset < startNode.textContent.length) {
                const newNodeBeforeCaret = document.createTextNode(startNode.textContent.substr(0, startOffset)),
                      newNodeAfterCaret = document.createTextNode(startNode.textContent.substr(startOffset));
                startNode.parentNode.replaceChild(newNodeBeforeCaret, startNode);
                if (newNodeBeforeCaret.nextSibling) {
                    newNodeBeforeCaret.parentNode.insertBefore(breakLineElement, newNodeBeforeCaret.nextSibling);
                    breakLineElement.parentNode.insertBefore(newNodeAfterCaret, breakLineElement.nextSibling);
                } else {
                    newNodeBeforeCaret.parentNode.appendChild(breakLineElement);
                    newNodeBeforeCaret.parentNode.appendChild(newNodeAfterCaret);
                }
            } else {
                if (!startOffset) {
                    startNode.parentNode.insertBefore(breakLineElement, startNode);
                } else {
                    if (startNode.nextSibling) {
                        startNode.parentNode.insertBefore(breakLineElement, startNode.nextSibling);
                    } else {
                        startNode.parentNode.appendChild(breakLineElement);
                    }
                }
            }
            if (breakLineElement.nextSibling) {
                selection.setSelectionAt({
                    startNode: breakLineElement.nextSibling,
                    startOffset: 0,
                    endNode: breakLineElement.nextSibling,
                    endOffset: 0
                });
            }
        }
    }
}

export { 
    getIntersectingFormattingOptions,
    getAppliedStyles,
    applyBlockNodes,
    selectAll,
    assertBrOnEmptyBlockNode,
    breakLine
};
