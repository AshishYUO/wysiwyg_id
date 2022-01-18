import selection from '../Selection';
import { getAppliedStyles, getIntersectingFormattingOptions } from '../Formatting';
import { getParentBlockNode } from './Block';

const getAllInlineNodes = (node) => {
    return node.nodeName.match(/^(SPAN|B|STRONG|I|EM|U|SUB|SUP|CODE)$/i);
}

const getAllInlineNodesInCurrentSelection = () => {
    const currentSelection = selection.getSelectionInfo();
}

/**
 * @details Insert string in a text node.
 * @param str string to insert.
 */
const insertString = (editor, str) => {
    const selections = selection.getSelection();
    const startNode = selections.getRangeAt(0).startContainer, startOffset = selections.getRangeAt(0).startOffset;
    if (selections.toString().length) {
        selections.deleteFromDocument();
    }
    if (startNode.nodeName === '#text') {
        startNode.insertData(startOffset, str);
        selection.setSelectionAt({
            startNode: startNode,
            startOffset: startOffset + str.length,
            endNode: startNode,
            endOffset: startOffset + str.length
        });
    }
}

/**
 * Retrieve all the text nodes.
 * @param startNode starting node of selection
 * @param endNode ending node of selection
 * @returns all text nodes that are currently selected
 */
const getAllTextNodes = (editor, startNode, endNode) => {
    const textNodes = startNode === endNode ? [startNode] : [];
    while (startNode !== endNode && startNode !== editor) {
        // Get leaf node (text node)
        while (startNode.nodeName !== '#text' && startNode.nodeName !== 'BR') {
            startNode = startNode.childNodes[0];
        }
        textNodes.push(startNode);
        // Get parent node till there is no next sibling.
        while (startNode !== endNode && startNode !== editor && !startNode.nextSibling) {
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
 * @param {*} editor 
 * @param {*} startNode 
 * @param {*} endNode 
 */
const applyInline = (editor, newStyle) => {
    const {
        startNode,
        endNode,
        startOffset,
        endOffset
    } = selection.getSelectionInfo();
    const allNodes = getAllTextNodes(editor, startNode, endNode);
    const [ intersectingNodes, align ] = getIntersectingFormattingOptions(editor, allNodes);
    console.log(intersectingNodes);
    const styleNodes = optimizeNodes(editor, allNodes);
    // Different logic for start and endNode, but apply all styles to remaining nodes.
    for (let i = 0; i < styleNodes.length; ++i) {
        const node = styleNodes[i];
        applyStyles(editor, node, newStyle, intersectingNodes);
    }
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
    // parentNode.replaceChild(node, );
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

export { optimizeNodes, insertString, getAllTextNodes, getAllInlineNodesInCurrentSelection, applyInline };
