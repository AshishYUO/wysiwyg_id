import selection from '../selection';
import Image from '../image';
import ToolBox from '../toolbox';
import {
    isABlockNode,
    addBlock,
    getParentBlockNode,
} from './block';
import {
    getAllTextNodes,
    insertString,
    optimizeNodes,
    applyInlineTemp,
    applyInline
} from './inline';

import {
    handleKeyboardDownEvent,
    handleKeyboardUpEvent
} from './event';


export default class Editor {
    editor: HTMLElement = null;      /// Editor Div (Contains body as well as toolbox)
    editorNode: HTMLElement = null;  /// Main Div Element for editing
    /**
     * Constructor node for Editor.
     * @param {HTMLElement} Node main editor node.
     */
    constructor(Node: HTMLElement) {
        this.editorNode = Node;
        this.editor = Node.querySelector('.bodyeditable');
        this.editor.innerHTML = '<div><br /></div>';
        const Toolbox = new ToolBox(Node, this);
        const image = new Image(Node);

        this.editor.onpaste = (event: Event) => {
            event.preventDefault();
            console.log('No paste implemetation yet!');
        }

        this.editor.onmouseup = (event: MouseEvent) => {
            Toolbox.formatsOnCurrentCaret();
        }

        this.editor.onkeydown = (event: KeyboardEvent) => {
            const { editor } = this;
            const handle = handleKeyboardDownEvent(editor, event);
            if (handle) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        this.editor.onkeyup = (event: KeyboardEvent) => {
            Toolbox.formatsOnCurrentCaret();
            const { editor } = this;
            handleKeyboardUpEvent(editor, event);
        };
    }

    /**
     * @brief Apply inline styling to elements
     * @memberof Editor
     * @param {Object} details details related to inline
     * @returns void
     */
    addInline(details: any) {
        applyInline(this.editor, 'B');
        applyInlineTemp(this.editor, details);
    }

    /**
     * @brief apply block stylign to selected elements
     * @memberof Editor
     * @param {Object} details 
     * @returns void
     */
    applyBlocks(details: any): void {
        addBlock(this.editor, details);
    }

    /**
     * @brief insert string at current caret selection
     * @param {String} str string to insert
     * @returns void.
     */
    insertString(str: string): void {
        insertString(this.editor, str);
    }

    /**
     * @brief Returns all text nodes which are selected
     * @returns {Array<HTMLElement>} Array of text elements that are under current
     * selection
     */
    getAllTextNodeInsideSelection(): any {
        const { 
            startNode,
            endNode 
        } = selection.getSelectionInfo();
        return getAllTextNodes(this.editor, startNode, endNode);
    }

    /**
     * @brief Returns the HTML content
     * @returns {string} HTMLContent
     */
    getHTMLContent(): string {
        return this.editor.innerHTML;
    }

    /**
     * @brief returns plain text of the editor content
     * @returns {string} innerText
     */
    getTextContent(): string {
        return this.editor.innerText;
    }
};
