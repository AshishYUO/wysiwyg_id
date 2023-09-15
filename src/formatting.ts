import { blockInEditor } from "./editor/block";
import selection from "./selection";
import { _, des, el, txt } from "element/helper";

const availableFormats = new Set([ 'B', 'I', 'U', 'SUB', 'SUP', 'H1', 'H2', 'BLOCKQUOTE', 'A', 'OL', 'UL' ]);
// const inlineStyles = new Set(['B', 'I', 'U', 'SUB', 'SUP', 'A']);

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

/**
 * @details Get all common intersecting styles applied to the selection
 * @param allTextNodes list of text nodes
 * @param body editor body.
 * @returns set of all styles applied.
 */
const getIntersectingFormattingOptions = (body, allTextNodes): any => {
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
    return [formatApplied, align];
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
 function applyBlockNodes(
    blockNodes: Array<HTMLElement | Node>,
    nodeName: string
): void {
    blockNodes.forEach((node, index, blockNodes) => {
        if (node.nodeName !== nodeName) {
            /// Move all children to the new node
            /// and replace with the node.
            const blockElement = el(nodeName)
                .inner([...node.childNodes])
                .replaceWith(node)
                .get();
            blockNodes[index] = blockElement;
        }
    });
}

/**
 * @brief Set the caret to select the entire text entered in here.
 * @param {HTMLElement} editor 
 */
const selectAll = (editor: HTMLElement | Node): void => {;
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

export { 
    getIntersectingFormattingOptions,
    getAppliedStyles,
    applyBlockNodes,
    selectAll
};
