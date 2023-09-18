import { iter, nodeIter } from "utils/iter";
import selection from "./selection";
import { _, el } from "element/helper";
import { None, Option, Some } from "utils/option";

const availableFormats = new Set([ 'B', 'I', 'U', 'SUB', 'SUP', 'H1', 'H2', 'BLOCKQUOTE', 'A', 'OL', 'UL' ]);
// const inlineStyles = new Set(['B', 'I', 'U', 'SUB', 'SUP', 'A']);

/**
 * @details Get intersection of setA and setB
 * @param firstSet 
 * @param secondSet 
 */
function intersection(
    firstSet: Set<string>,
    secondSet: Set<string>
): Set<string> {
    return new Set<string>(
        iter<string>(firstSet)
            .filter(v => secondSet.has(v))
    );
}

/**
 * @details Get all common intersecting styles applied to the selection
 * @param allTextNodes list of text nodes
 * @param body editor body.
 * @returns set of all styles applied.
 */
function getIntersectingFormattingOptions(
    body: HTMLElement,
    allTextNodes: HTMLElement[]
): [Set<string> | [], string] {
    let align = None<string>();
    let formatApplied = new Set([...availableFormats]);
    
    iter(allTextNodes).takeWhile(_ => formatApplied.size > 0).forEach(node => {
        const currentFormat = new Set<string>();

        nodeIter(node, n => n.parentElement)
            .till(n => n !== body)
            .forEach(traverse => {
                currentFormat.add(traverse.nodeName);
                align = traverse.style?.textAlign ? 
                    Some(traverse.style.textAlign) : 
                    align;
            });

        formatApplied = intersection(formatApplied, currentFormat);
    });

    return [allTextNodes.length ? formatApplied: [], align.get()];
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
