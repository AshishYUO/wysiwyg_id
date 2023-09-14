import selection from "selection";
import { getParentBlockNode } from "../editor/block";

export const DOM = {
    
    /**
     * Creates an HTMLElement
     * @param textContent 
     * @returns 
     */
    createElement: (tagName, options?) => {
        const newElement = document.createElement(tagName, options);
        newElement.insertAfter = (newNode, nodeRelativeTo) => {
            if (![...newElement.childNodes].some(node => node === nodeRelativeTo)) {
                throw Error('Node Relative to cannot be found');
            } else {
                if (nodeRelativeTo.nextSibling) {
                    newElement.insertBefore(newNode, nodeRelativeTo.nextSibling);
                } else {
                    newElement.appendChild(newNode);
                }
            }
        }
        return newElement;
    },

    /**
     * Creates text node
     * @param textContent 
     * @returns 
     */
    createTextNode: (textContent) => {
        const textNode = document.createTextNode(textContent);
        textNode['insertAfter'] = (newNode, nodeRelativeTo) => {
            if (nodeRelativeTo.nextSibling) {
                textNode.insertBefore(newNode, nodeRelativeTo.nextSibling);
            } else {
                textNode.appendChild(newNode);
            }
        };
        return textNode;
    },
    /**
     * Query Selector for DOM
     * @param selector 
     * @returns 
     */
    querySelector: (selector) => {
        return document.querySelector(selector);
    },
    querySelectorAll: (selector) => {
        return document.querySelectorAll(selector);
    },
}
