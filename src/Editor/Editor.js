import Selection from '../Selection';
import Image from '../Image';
import ToolBox from '../Toolbox';
import Block from './Block';
import { PasteFormattingOptions } from '../CodeFormatting';
import { isABlockNode, isAnInlineNode } from '../Utils';

const selections = new Selection();

export default class Editor {
    constructor(Node) {
        const Toolbox = new ToolBox(Node, this);
        const image = new Image(Node);
        this.Block = new Block(this);
        this.editorNode = Node;
        this.Body = Node.getElementsByClassName("bodyeditable")[0];
        this.Body.innerHTML = "<P><br></P>";
        this.Body.onpaste = (event) => {
            this.IfBodyIsEmpty();
            if (selections.getSelection().toString().length > 0) {
                selections.getSelection().deleteFromDocument();
            }
            let data = (event.clipboardData || window.clipboardData).getData('text/html');
            if (data.length != 0) {
                console.log(data);
                event.preventDefault();
                let div = document.createElement('DIV');
                div.innerHTML = data;
                div.innerHTML = this.clearNode(div).innerHTML;
                selections.getSelection().getRangeAt(0).insertNode(div);
            }
        }

        this.Body.onmouseup = function (event) {
            Toolbox.formatsOnCurrentCaret();
        }.bind(this);

        this.Body.onkeydown = function (event) {
            this.IfBodyIsEmpty();
            if (event.key == "Tab") {
                event.preventDefault();
                let textNode = document.createTextNode("\xA0\xA0\xA0\xA0");
                selections.getSelection && selections.getSelection().getRangeAt(0).insertNode(textNode);
                let tab = selections.getSelectionInfo();
                selections.setSelectionAt({
                    startNode: tab.endNode,
                    startOffset: tab.endOffset,
                    endNode: tab.endNode,
                    endOffset: tab.endOffset
                })
            }
            Toolbox.formatsOnCurrentCaret();
        }.bind(this);

        this.Body.onkeyup = function (event) {
            this.IfBodyIsEmpty();
            Toolbox.formatsOnCurrentCaret();
        }.bind(this);

        this.Body.addEventListener("add_inline", function (event) {
            let { cmd, valArg } = event.detail;
            document.execCommand(cmd, false, valArg);
        });

        this.Body.addEventListener("reset_caret", function(event) {
            if (!this.children || !this.children) {
                let firstNode = document.createElement('P');
                firstNode.innerHTML = "<br />";
                this.appendChild(firstNode);
            }
            selections.setCaretPositionAtNode(this.children[0]);
        });
    }

    addInline(details) {
        let { cmd, valArg } = details;
        document.execCommand(cmd, false, valArg);
    }
    
    // Incomplete: if at least one of the child is a block node, take it out from there.
    clearNode(node) {
        if ((node.childNodes && node.innerText && node.innerText.length > 0) || typeof (node) === 'object') {
            if (isAnInlineNode(node) && node.innerText == "") {
                node.parentNode && node.parentNode.removeChild(node);
                return;
            }
            let newNode = document.createElement('P');
            if (node.nodeName.match(/H[1-6]/) || node.nodeName.match(/^(BLOCKQUOTE|SUB|SUP|B|I|U|EM|STRONG|HR|LI|OL|UL|SPAN|A|IMG|PRE|CODE|BR|TABLE|TD|TR|TH|THEAD|TBODY)$/)) {
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

    getCaretNode(newNode, temp, caretNode, isTextNode) {
        let domRet;
        let temp_length = temp.childNodes.length, newNode_length = newNode.childNodes.length;
        for (let i = 0, j = 0; i < temp_length && j < newNode_length; ++i, ++j) {
            domRet = this.getCaretNode(newNode.childNodes[j], temp.childNodes[i], caretNode, isTextNode) || domRet;
            if (domRet) {
                return domRet;
            }
            if (caretNode == temp.childNodes[i]) {
                return newNode.childNodes[i];
            }
        }
        if (caretNode == temp) {
            return newNode;
        }
        return domRet;
    }

    traverseAllSelectedTextNodes (startNode, endNode) {
        if (startNode == endNode) {
            return [endNode];
        }
        while (startNode && startNode.childNodes && startNode.childNodes.length > 0) {
            startNode = startNode.childNodes[0];
        }
        let elem;
        if (startNode.nodeName == '#text') {
            elem = [startNode];
        }
        if (startNode == endNode) {
            return elem || [];
        }
        while (!startNode.nextSibling && startNode != this.Body) {
            startNode = startNode.parentNode;
        }
        if (startNode != this.Body) {
            if (elem) {
                return [...elem, ...this.traverseAllSelectedTextNodes(startNode.nextSibling, endNode)];
            } else {
                return this.traverseAllSelectedTextNodes(startNode.nextSibling, endNode);
            }
        }
        return [];
    }

    getAllTextNodeInsideSelection() {
        let selection = selections.getSelectionInfo();
        return this.traverseAllSelectedTextNodes(selection.startNode, selection.endNode);
    }

    addBlock(details) {
        // console.log(this.getAllTextNodeInsideSelection());
        this.Block.addBlock(details);
    }

    focusOnBody() {
        this.Body.focus();
        const selectionInfo = selections.getSelectionInfo();
        if (!selectionInfo || selectionInfo.startNode === this.Body) {
            selections.setSelectionAt({
                startNode: this.Body.children[0],
                startOffset: 0,
                endNode: this.Body.children[0],
                endOffset: 0,
            });
        }
    }

    addList(details) {
        this.IfBodyIsEmpty();
        let type = details.nodeName;
        let Node = selections.getCurrentNodeFromCaretPosition();
        if (Node) {
            while (!isABlockNode(Node) && Node.parentNode != this.Body) {
                Node = Node.parentNode;
            }
            if (Node !== this.Body) {
                let element = document.createElement(type), list = document.createElement("li");
                list.innerHTML = Node.innerHTML;
                element.append(list);
                if (Node.nodeName !== "LI") {
                    Node.parentNode.replaceChild(element, Node);
                } else {
                    Node.innerHTML = element.outerHTML;
                }
            }
        }
    }

    IfBodyIsEmpty() {
        if (this.Body.innerHTML == "" || this.Body.innerHTML == "<br>") {
            this.Body.innerHTML = "<P><br></P>";
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
