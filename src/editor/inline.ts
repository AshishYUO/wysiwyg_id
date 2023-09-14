import selection from '../selection';
import { getAppliedStyles, getIntersectingFormattingOptions } from '../formatting';
import { getParentBlockNode } from './block';

/**
 * @details Insert string in a text node.
 * @param {HTMLElement} editor main editor element
 * @param {String} str string to insert.
 * @returns void
 */
function insertString(editor: HTMLElement, str: string) {
    const selections = selection.getSelection();
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

/**
 * 
 * @param {HTMLElement} editor 
 * @param {HTMLElement} startNode 
 * @param {HTMLElement} endNode 
 */
function applyInline(editor: Node, newStyle: string) {
    const {
        startNode,
        endNode,
        startOffset,
        endOffset
    } = selection.getSelectionInfo();
    const allNodes = getAllTextNodes(editor, startNode, endNode);
    const [intersectingNodes, align] = getIntersectingFormattingOptions(editor, allNodes);
    // console.log('Common styles', intersectingNodes);
    const styleNodes = optimizeNodes(editor, allNodes);
    console.log('All Nodes selected: ', styleNodes);
    // Different logic for start and endNode, but apply all styles to remaining nodes.
    // styleNodes.forEach(node => applyStyles(editor, node, newStyle, intersectingNodes));
}

const applyInlineTemp = (editor: Node, details: any) => {
    const { cmd, valArg } = details;
    document.execCommand(cmd, false, valArg);
}

const applyStyles = (editor, element, newStyle, intersectingNodes) => {
    const { styles, node } = element;
    styles.forEach(style => {
        if (style !== newStyle) {
            const elem = document.createElement(style);
            node.parentNode.replaceChild(elem, node);
            elem.appendChild(node);
        }
    });
    if (!intersectingNodes.has(newStyle)) {
        const elem = document.createElement(newStyle);
        node.parentNode.replaceChild(elem, node);
        elem.appendChild(node);
    }
}

/**
 * @todo Merge two or more consecutive text nodes into one based on styling.
 * @param startNode 
 * @param endNode 
 */
const optimizeNodes = (editor, allNodes) => {
    const styles = allNodes.map(node => {
        return {
            node: node,
            styles: getAppliedStyles(editor, node)
        }
    })
    return styles;
}

const getAllTextNodesInsideBlockNode = (editor, blockNode) => {
    let startNode = blockNode;
    while (startNode.childNodes || startNode.childNodes.length) {
        startNode = startNode.childNodes[0];
    }
    
}

export {
    optimizeNodes,
    insertString,
    getAllTextNodes,
    applyInline,
    applyInlineTemp
};
