import { el, eltxt } from 'element/helper';
import selection from '../selection';
import { nodeIter } from 'utils/iter';
import { None, Option, Some } from 'utils/option';

/**
 * @details Insert string in a text node.
 * @param {HTMLElement} editor main editor element
 * @param {String} str string to insert.
 * @returns void
 */
function insertString(editor: HTMLElement, str: string) {
    const { startNode, startOffset } = selection.getSelectionInfo().get();
    const sel = selection.sel().get();

    if (sel.toString().length) {
        sel.deleteFromDocument();
    }
    const [selectedNode, selectedOffset] = selection.forceTextNodeSelection(startNode, startOffset);
    if (selectedNode.nodeType === 1) {
        const textNode = document.createTextNode(str),
              textOffset = str.length;
        if (selectedOffset === 1) {
            eltxt(textNode).nextTo(selectedNode)
        } else {
            // selectedNode.parentNode.insertBefore(textNode, selectedNode);
            eltxt(textNode).before(selectedNode);
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

type TraverseInfo = [Option<Node>, Option<Node>];

function makeMove(
    [prevNode, currNode]: TraverseInfo
): TraverseInfo  {
    if (prevNode.isSome() && currNode.isSome()) {
        const [prev, curr] = [prevNode.get(), currNode.get()];
        if (curr === prev.parentNode) {
            if (curr.nextSibling) {
                return [Some(curr), Some(curr.nextSibling)];
            } 
            return [Some(curr), Some(curr.parentNode)];
        } else {
            if (curr.childNodes && curr.childNodes.length >= 1) {
                return [Some(curr), Some(curr.childNodes[0])];
            }
            if (curr.nextSibling) {
                return [Some(curr), Some(curr.nextSibling)];
            }

            return [Some(curr), Some(curr.parentNode)];
        }
    } else if (currNode.isSome() && prevNode.isNone()) {
        const curr = currNode.get();
        if (curr.childNodes && curr.childNodes.length >= 1) {
            return [currNode, Some(curr.childNodes[0])]
        } else if (curr.nextSibling) {
            return [currNode, Some(curr.nextSibling)];
        } 
        
        return [currNode, Some(curr.parentNode)];
    }
    return [None(), None()];
}

/**
 * Retrieve all the text nodes.
 * @param startNode starting node of selection
 * @param endNode ending node of selection
 * @returns all text nodes that are currently selected
 */
function getAllTextNodes(
    editor: Node, 
    startNode: Node, 
    endNode: Node
) {
    const initialState: TraverseInfo = [None<Node>(), Some(startNode)];
    // const textNodes = startNode === endNode ? [startNode] : [];
    const textNodes = [
        ...nodeIter(initialState, makeMove, true)
            .till(([_, curr]) => curr.isSomeAnd(n => (
                n !== endNode && n !== null
            )))
            .filter(([_, curr]) => curr.isSome() && curr.get().nodeType === 3)
            .map(([_, curr]) => curr.get())
    ];

    console.log(textNodes);
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
