import selection from "../selection";
import { isABlockNode } from "./block";
/**
 * @details Perform list operation in a different file.
 * @param details 
 */
export const addList = (editor, details) => {
    const type = details.nodeName;
    let node = selection.getCurrentNodeFromCaretPosition();
    if (node) {
        while (!isABlockNode(node) && node.parentNode != editor) {
            node = node.parentNode;
        }
        if (node !== editor) {
            const element = document.createElement(type), list = document.createElement('LI');
            list.innerHTML = (node as HTMLElement).innerHTML;
            element.append(list);
            if (node.nodeName !== 'LI') {
                node.parentNode.replaceChild(element, node);
            } else {
                (node as HTMLElement).innerHTML = element.outerHTML;
            }
        }
    }
}
