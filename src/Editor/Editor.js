import selection from '../Selection';
import Image from '../Image';
import ToolBox from '../Toolbox';
import {
    isABlockNode,
    addBlock,
    getParentBlockNode,
    assertTextNodeOrBreakLine,
} from './Block';
import {
    getAllTextNodes,
    insertString,
    optimizeNodes,
    applyInlineTemp
} from './Inline';

import {
    handleKeyboardDownEvent,
    handleKeyboardUpEvent
} from './Event';

// Incomplete: pasted text should have all block/list nodes in one level.
const clearNode = (node) => {
    if ((node.childNodes && node.innerText && node.innerText.length > 0) || typeof (node) === 'object') {
        if (isAnInlineNode(node) && node.innerText.length === "") {
            node.parentNode && node.parentNode.removeChild(node);
            return;
        }
        const newNode = document.createElement('P');
        if (node.nodeName.match(/^H[1-6]$/) || node.nodeName.match(/^(BLOCKQUOTE|SUB|SUP|B|I|U|EM|STRONG|HR|LI|OL|UL|SPAN|A|IMG|PRE|CODE|BR|TABLE|TD|TR|TH|THEAD|TBODY)$/)) {
            if (node.nodeName == 'LI' && (node.parentNode && node.parentNode.nodeName != 'OL' && node.parentNode.nodeName != 'UL')) {
                newNode = document.createElement('P');
            } else {
                newNode = document.createElement(node.nodeName);
            }
        } else if (node.nodeName == 'DIV' || node.nodeName == 'P') {
            newNode = document.createElement('P');
        }
        let toChange;
        if (PasteFormattingOptions[node.nodeName]) {
            toChange = PasteFormattingOptions[node.nodeName](node, newNode);
        }         
        for (let child of node.children) {
            this.clearNode(child);
        }
        if (toChange === undefined) {
            newNode.innerHTML = node.innerHTML;
        }
        if (node.parentNode) {
            node.parentNode.replaceChild(newNode, node);
        }
        return newNode;
    }
}

export default class Editor {
    /**
     * Constructor node for Editor.
     * @param {HTMLElement} Node main editor node.
     */
    constructor(Node) {
        this.editorNode = Node;
        this.editor = Node.querySelector('.bodyeditable');
        console.log(this.editor);
        this.editor.innerHTML = '<p><br /></p>';
        const Toolbox = new ToolBox(Node, this);
        const image = new Image(Node);

        this.editor.onpaste = event => {
            event.preventDefault();
            console.log('No paste implemetation yet!');
        }

        this.editor.onmouseup = event => {
            selection.ensureCaretSelection();
            Toolbox.formatsOnCurrentCaret();
        }

        this.editor.onkeydown = event => {
            // const parentBlockNode = getParentBlockNode();
            const { editor: editor } = this;
            const handle = handleKeyboardDownEvent(editor, event);
            if (handle) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        this.editor.onkeyup = event => {
            Toolbox.formatsOnCurrentCaret();
            const { editor: editor } = this;
            handleKeyboardUpEvent(editor, event);
        };
    }

    /**
     * @brief Apply inline styling to elements
     * @memberof Editor
     * @param {Object} details details related to inline
     * @returns void
     */
    addInline (details) {
        applyInlineTemp(this.editor, details);
    }

    /**
     * @brief apply block stylign to selected elements
     * @memberof Editor
     * @param {Object} details 
     * @returns void
     */
    applyBlocks(details) {
        addBlock(this.editor, details);
    }

    /**
     * @brief insert string at current caret selection
     * @param {String} str string to insert
     * @returns void.
     */
    insertString(str) {
        insertString(this.editor, str);
    }

    /**
     * @brief Returns all text nodes which are selected
     * @returns {Array<HTMLElement>} Array of text elements that are under current
     * selection
     */
    getAllTextNodeInsideSelection() {
        const { 
            startNode,
            endNode 
        } = selection.getSelectionInfo();
        return getAllTextNodes(this.editor, startNode, endNode);
    }

    /**
     * @brief Returns the HTML content
     * @returns {String} HTMLContent
     */
    getHTMLContent() {
        return this.editor.innerHTML;
    }

    /**
     * @brief returns plain text of the editor content
     * @returns {String} innerText
     */
    getTextContent() {
        return this.editor.innerText;
    }
};
