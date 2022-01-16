import Selection from '../Selection';
import Image from '../Image';
import ToolBox from '../Toolbox';
import Block from './Block';
import Inline from './Inline';
import { PasteFormattingOptions } from '../CodeFormatting';

const selections = new Selection();

export default class Editor {
    constructor(Node) {
        this.Block = new Block(this);
        this.inline = new Inline(this);
        this.editorNode = Node;
        this.Body = Node.querySelector('.bodyeditable');
        this.Body.innerHTML = "<P><br></P>";
        const Toolbox = new ToolBox(Node, this);
        const image = new Image(Node);
        this.Body.onpaste = event => {
            this.ifBodyIsEmpty();
            // if (selections.getSelection().toString().length > 0) {
            //     selections.getSelection().deleteFromDocument();
            // }
            // const data = (event.clipboardData || window.clipboardData).getData('text/html');
            // if (data.length != 0) {
            event.preventDefault();
            // const div = document.createElement('DIV');
            // div.innerHTML = data;
            // div.innerHTML = this.clearNode(div).innerHTML;
            console.log('No paste implemetation yet!');
            // }
        }

        this.Body.onmouseup = event => {
            Toolbox.formatsOnCurrentCaret();
        }

        this.Body.onkeydown = event => {
            this.ifBodyIsEmpty();
            if (event.key === 'Tab') {
                event.preventDefault();
                this.inline.insertString('\xA0\xA0\xA0\xA0');
            } else if (event.key === 'Enter') {
                this.checkIfDiv();
            }
            Toolbox.formatsOnCurrentCaret();
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
        const selection = selections.getSelectionInfo();
        let node = selection.startNode;
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
                selections.setSelectionAt(selection);
            }
        }
    }
    
    construct (nodeArray) {
        let parentNode = undefined;
        const dictionary = [];
        for (const node of nodeArray) {
            let temp = node;
            while (!this.Block.isABlockNode(temp)) {
                temp = temp.parentNode;
            }
            if (parentNode != temp) {
                parentNode = temp;
                dictionary.push({blockParent: parentNode, child: [{node: node}]});
            } else {
                dictionary[dictionary.length - 1].child.push(node);
            }
        }
        return dictionary;
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
    

    addBlock(details) {
        this.Block.addBlock(details);
    }

    insertString(str) {
        this.inline.insertString(str);
    }

    getAllTextNodeInsideSelection() {
        const selection = selections.getSelectionInfo();
        return this.inline.getAllTextNodes(selection.startNode, selection.endNode);
    }

    focusOnBody() {
        this.Body.focus();
        const selectionInfo = selections.getSelectionInfo()
        if (!selectionInfo) {
            selections.setSelectionAt({
                startNode: this.Body.children[0],
                startOffset: 0,
                endNode: this.Body.children[0],
                endOffset: 0,
            });
        }
    }

    addList(details) {
        this.ifBodyIsEmpty();
        const type = details.nodeName;
        let Node = selections.getCurrentNodeFromCaretPosition();
        if (Node) {
            while (!this.Block.isABlockNode(Node) && Node.parentNode != this.Body) {
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
