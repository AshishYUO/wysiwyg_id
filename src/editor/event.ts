import selection from "../selection";
import { el } from "element/helper";

/**
 * 
 * @param {HTMLDivElement} editor 
 */
const assertSelectionOnEmpty = (editor: HTMLElement | Node): void => {
    let {
        startNode,
        endNode,
        startOffset,
        endOffset
    } = selection.getSelectionInfo().get();
    if (startNode === endNode && startOffset === endOffset) {
        while (startNode.childNodes.length && startNode.nodeName !== 'BR') {
            startNode = startNode.childNodes[0];
        }
        if (startNode.nodeType === 1) {
            if (startNode.nodeName !== 'BR' && !startNode.childNodes.length) {
                startNode.appendChild(el('br').get());
                startNode = startNode.childNodes[0];
                selection.setSelectionAt({
                    startNode: startNode,
                    endNode: startNode,
                    startOffset: 0,
                    endOffset: 0
                });
            }
        }
    }
}

// return true or false depending on whether to 
// prevent default actions or not.
const eventKeys = {
    // Enter: (editor, event) => {
    //     // todo: make a enter function, to eliminate dependencies.
    //     return false;
    // },
    // Backspace: (editor, event) => {
    //     // todo: manual backspace function
    //     return handleDelete(editor, event);
    // },
    // Delete: (editor, event) => {
    //     // todo: manual delete function
    //     return handleDelete(editor, event);
    // },
    // Tab: (editor, event) => {
    //     insertString(editor, '\xA0\xA0\xA0\xA0');
    //     return true;
    // },
    // Control: {
    //     a: (editor, event) => {
    //         // selectAll(editor);
    //         return false;
    //     },
    //     z: (editor, event) => {
    //         return false;
    //     },
    //     b: (editor, event) => {
    //         applyInlineTemp(editor, { cmd: 'bold' });
    //         return true;
    //     },
    //     i: (editor, event) => {
    //         applyInlineTemp(editor, { cmd: 'italic' });
    //         return true;
    //     },
    //     u: (editor, event) => {
    //         applyInlineTemp(editor, { cmd: 'underline' });
    //         return true;
    //     },
    //     Shift: {
    //         ArrowUp: (editor, event) => {
    //             applyInlineTemp(editor, { cmd: 'superscript' });
    //             return true;
    //         },
    //         ArrowDown: (editor, event) => {
    //             applyInlineTemp(editor, { cmd: 'subscript' });
    //             return true;
    //         },
    //         z: (editor, event) => {
    //             return false;
    //         }
    //     }
    // },
    // ' ': (editor, event) => {
    //     // insertString(editor, '\xA0');
    //     return true;
    // },
    Shift: {
        Enter: (editor: any, event: Event) => {
            // breakLine(editor);
            return true;
        }
    }
}

var keyPressed: any = eventKeys;
const parent: Array<{
    key: string,
    pos: any
}> = [];

/**
 * @description handle keyboard down events
 * @param {HTMLElement} editor 
 * @param {Event} event 
 * @returns boolean if preventDefault
 */
const handleKeyboardDownEvent = (editor: HTMLElement, event: KeyboardEvent) => {
    if (keyPressed.hasOwnProperty(event.key)) {
        parent.push({
            key: event.key,
            pos: keyPressed
        });
        if (typeof keyPressed[event.key] === 'function') {
            return keyPressed[event.key](editor, event);
        }
        keyPressed = keyPressed[event.key];
    }
    if (editor.textContent.length === 0) {
        el(editor as HTMLElement).innerHtml('<div><br /></div>');
    }
}

/**
 * @description Handle events related when a key is released.
 * @param {HTMLElement} editor 
 * @param {KeyboardEvent} event 
 */
function handleKeyboardUpEvent(
    editor: HTMLElement | Node, 
    event: KeyboardEvent
): void {
    if (parent.length) {
        let keyEvent = parent[parent.length - 1];
        if (!keyEvent.pos.hasOwnProperty(event.key)) {
            while (parent.length && keyEvent.key !== event.key) {
                keyEvent = parent.pop();
            }
            keyPressed = keyEvent.pos;
        }
    }
    if (editor.textContent.length === 0) {
        el(editor as HTMLElement).innerHtml('<div><br /></div>');
    }
    assertSelectionOnEmpty(editor);
}

export {
    handleKeyboardDownEvent,
    handleKeyboardUpEvent
};
