import selection from "./selection";
import { _, el } from "element/helper";

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
function getIntersectingFormattingOptions(body, allTextNodes): any {
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
    return [allTextNodes.length ? formatApplied: [], align];
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

export { 
    getIntersectingFormattingOptions,
    applyBlockNodes
};
