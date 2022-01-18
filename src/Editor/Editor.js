import selection from '../Selection';
import Image from '../Image';
import ToolBox from '../Toolbox';
import {
    isABlockNode,
    addBlock
} from './Block';
import {
    getAllTextNodes,
    insertString,
    optimizeNodes
} from './Inline';

export default class Editor {
    constructor(Node) {
        this.editorNode = Node;
        this.Body = Node.querySelector('.bodyeditable');
        this.Body.innerHTML = "";
        const Toolbox = new ToolBox(Node, this);
        const image = new Image(Node);
        
        this.Body.onpaste = event => {
            this.ifBodyIsEmpty();
            event.preventDefault();
            console.log('No paste implemetation yet!');
        }

        this.Body.onmouseup = event => {
            Toolbox.formatsOnCurrentCaret();
        }

        this.Body.onkeydown = event => {
            this.ifBodyIsEmpty();
            switch(event.key) {
                case 'Tab':
                    event.preventDefault();
                    insertString(this.Body, '\xA0\xA0\xA0\xA0');
                    break;
                case 'Enter':
                    this.checkIfDiv();
                    break;
            }
        }

        this.Body.onkeyup = event => {
            this.ifBodyIsEmpty();
            Toolbox.formatsOnCurrentCaret();
        };
    }
    // Incomplete, add better inline.
    addInline (details) {
        const { cmd, valArg } = details;
        document.execCommand(cmd, false, valArg);
    }

    checkIfDiv () {
        const {
            startNode
        } = selection.getSelectionInfo();
        let node = startNode;
        while (node.parentNode !== this.Body) {
            node = node.parentNode;
        } 
        if (node.parentNode !== this.Body) {
            if (node.nodeName === 'DIV') {
                const blockElement = document.createElement('P');
                for (const childNode of node.childNodes) {
                    blockElement.appendChild(childNode);
                }
                Node.parentNode.replaceChild(blockElement, node);
                selection.setSelectionAt(selection);
            }
        }
    }

    // Incomplete: pasted text should have all block/list nodes in one level.
    clearNode (node) {
        if ((node.childNodes && node.innerText && node.innerText.length > 0) || typeof (node) === 'object') {
            if (isAnInlineNode(node) && node.innerText == "") {
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

    applyBlocks(details) {
        addBlock(this.Body, details);
    }

    insertString(str) {
        insertString(this.Body, str);
    }

    getAllTextNodeInsideSelection() {
        const { startNode, endNode } = selection.getSelectionInfo();
        return getAllTextNodes(this.Body, startNode, endNode);
    }

    focusOnBody() {
        this.Body.focus();
        const selectionInfo = selection.getSelectionInfo()
        if (!selectionInfo) {
            selection.setSelectionAt({
                startNode: this.Body.children[0],
                startOffset: 0,
                endNode: this.Body.children[0],
                endOffset: 0,
            });
        }
    }

    /**
     * @details Perform list operation in a different file.
     * @param details 
     */
    addList(details) {
        this.ifBodyIsEmpty();
        const type = details.nodeName;
        let Node = selection.getCurrentNodeFromCaretPosition();
        if (Node) {
            while (!isABlockNode(this.Body, Node) && Node.parentNode != this.Body) {
                Node = Node.parentNode;
            }
            if (Node !== this.Body) {
                const element = document.createElement(type), list = document.createElement('li');
                list.innerHTML = Node.innerHTML;
                element.append(list);
                if (Node.nodeName !== 'LI') {
                    Node.parentNode.replaceChild(element, Node);
                } else {
                    Node.innerHTML = element.outerHTML;
                }
            }
        }
    }

    ifBodyIsEmpty() {
        if (this.Body.innerHTML == '' || this.Body.innerHTML == '<br>') {
            this.Body.innerHTML = '<P><br /></P>';
        }
        this.focusOnBody();
    }

    getHTMLContent() {
        return this.Body.innerHTML;
    }

    getTextContent() {
        return this.Body.innerText;
    }
};
