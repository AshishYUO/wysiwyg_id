import { insertString, applyInlineTemp } from "./Inline"
import { selectAll, assertBrOnEmptyBlockNode, breakLine } from '../Formatting';
import selection from "../Selection";

/**
 * 
 * @param {HTMLDivElement} editor 
 */
const assertSelectionOnEmpty = (editor: HTMLDivElement): void => {
    let {
        startNode,
        endNode,
        startOffset,
        endOffset
    } = selection.getSelectionInfo();
    if (startNode === endNode && startOffset === endOffset) {
        while (startNode.childNodes.length && startNode.nodeName !== 'BR') {
            startNode = startNode.childNodes[0];
        }
        if (startNode.nodeType === 1) {
            if (startNode.nodeName !== 'BR' && !startNode.childNodes.length) {
                startNode.appendChild(document.createElement('BR'));
                startNode = startNode.childNodes[0];
            }
            selection.setSelectionAt({
                startNode: startNode,
                endNode: startNode,
                startOffset: 0,
                endOffset: 0
            });
        }
    }
}

const eventKeys = {
    Enter: (editor, event) => {
        // todo: make a enter function, to eliminate dependencies.
        return false;
    },
    Backspace: (editor, event) => {
        // todo: manual backspace function
        return handleDelete(editor, event);
    },
    Delete: (editor, event) => {
        // todo: manual delete functionality
        return handleDelete(editor, event);
    },
    Tab: (editor, event) => {
        insertString(editor, '\xA0\xA0\xA0\xA0');
        return true;
    },
    Control: {
        a: (editor, event) => {
            selectAll(editor);
            return true;
        },
        z: (editor, event) => {
            return false;
        },
        b: (editor, event) => {
            applyInlineTemp(editor, { cmd: 'bold' });
            return true;
        },
        i: (editor, event) => {
            applyInlineTemp(editor, { cmd: 'italic' });
            return true;
        },
        u: (editor, event) => {
            applyInlineTemp(editor, { cmd: 'underline' });
            return true;
        },
        Shift: {
            ArrowUp: (editor, event) => {
                applyInlineTemp(editor, { cmd: 'superscript' });
                return true;
            },
            ArrowDown: (editor, event) => {
                applyInlineTemp(editor, { cmd: 'subscript' });
                return true;
            },
            z: (editor, event) => {
                return false;
            }
        }
    },
    ' ': (editor, event) => {
        insertString(editor, '\xA0');
        return true;
    },
    Shift: {
        Enter: (editor, event) => {
            breakLine(editor);
            return true;
        }
    }
}

var keyPressed = eventKeys;
const parent: Array<{
    key: string,
    pos: any
}> = [];

/**
 * @details Handle delete/backspace button event
 * @param {HTMLElement} editor 
 * @param {Event} event 
 * @returns 
 */
const handleDelete = (editor, event) => {
    if (editor.childNodes.length === 1 && editor.childNodes[0].childNodes.length === 1 && editor.childNodes[0].childNodes[0].nodeName === 'BR') {
        return true;
    }
    assertBrOnEmptyBlockNode(editor, false);
    return false;
}

/**
 * @details handle keyboard down events
 * @param {HTMLElement} editor 
 * @param {Event} event 
 * @returns boolean if preventDefault
 */
const handleKeyboardDownEvent = (editor: HTMLElement, event: KeyboardEvent): boolean => {
    if (keyPressed.hasOwnProperty(event.key)) {
        if (typeof keyPressed[event.key] === 'function') {
            return keyPressed[event.key](editor, event);
        } else if (typeof keyPressed[event.key] === 'object') {
            parent.push({
                key: event.key,
                pos: keyPressed
            });
            keyPressed = keyPressed[event.key];
        }
    }
    return false;
}

const handleKeyboardUpEvent = (editor, event) => {
    if (parent.length) {
        let keyEvent = parent[parent.length - 1];
        while (parent.length && keyEvent.key !== event.key) {
            keyEvent = parent.pop();
        }
        keyPressed = keyEvent.pos;
    }
    assertBrOnEmptyBlockNode(editor, event.key !== 'Backspace');
    assertSelectionOnEmpty(editor);
}

export {
    handleKeyboardDownEvent,
    handleKeyboardUpEvent
};
