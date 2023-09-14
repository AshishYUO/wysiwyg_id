import selection from '../selection';
import Image from '../image';
import ToolBox from '../toolbox';
import { addBlock } from './block';
import {
    getAllTextNodes,
    insertString,
    applyInlineTemp,
} from './inline';

import { handleKeyboardDownEvent, handleKeyboardUpEvent } from './event';
import { el, elquery } from 'element/helper';


export default class Editor {
    editor: HTMLElement = null;      /// Editor Div (Contains body as well as toolbox)
    editorNode: HTMLElement = null;  /// Main Div Element for editing
    /**
     * Constructor node for Editor.
     * @param {HTMLElement} Node main editor node.
     */
    constructor(Node: HTMLElement) {
        this.editorNode = Node;
        const toolbox = new ToolBox(Node, this);
        const image = new Image(Node);

        this.editor = elquery('.bodyeditable').doGet((elem) => (
            el(elem)
                .innerHtml('<div><br /></div>')
                .evt('paste', (evt) => {
                    evt.preventDefault(); console.log('No paste implementation');
                })
                .evt('mouseup', (evt) => toolbox.formatsOnCurrentCaret())
                .evt('keydown', (evt: KeyboardEvent) => {
                    handleKeyboardDownEvent(this.editor, evt);
                })
                .evt('keyup', (event: KeyboardEvent) => {
                    toolbox.formatsOnCurrentCaret();
                    handleKeyboardUpEvent(this.editor, event);
                })
            ));
    }

    /**
     * @brief Apply inline styling to elements
     * @memberof Editor
     * @param {Object} details details related to inline
     * @returns void
     */
    addInline(details: any) {
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
        const { startNode, endNode } = selection.getSelectionInfo().get();
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
