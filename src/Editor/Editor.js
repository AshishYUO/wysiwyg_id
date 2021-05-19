import Selection from '../Selection';
import Image from '../Image';
import ToolBox from '../Toolbox';
import { PasteFormattingOptions } from '../CodeFormatting';
import { isABlockNode, isAnInlineNode } from '../Utils';

const selections = new Selection();

export default class Editor {
    constructor(Node) {
        const Toolbox = new ToolBox(Node, this);
        const image = new Image(Node);
        this.editorNode = Node;
        this.Body = Node.getElementsByClassName("bodyeditable")[0];
        this.Body.innerHTML = "<div><br></div>";
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
            selections.setCaretPositionAtNode(this.children[0] || this);
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
            let newNode = document.createElement('DIV');
            if (node.nodeName.match(/H[1-6]/) || node.nodeName.match(/^(BLOCKQUOTE|SUB|SUP|B|I|U|EM|STRONG|HR|LI|OL|UL|SPAN|A|IMG|PRE|CODE|BR|TABLE|TD|TR|TH|THEAD|TBODY)$/)) {
                if (node.nodeName == 'LI' && (node.parentNode && node.parentNode.nodeName != 'OL' && node.parentNode.nodeName != 'UL')) {
                    newNode = document.createElement('DIV');
                } else {
                    newNode = document.createElement(node.nodeName);
                }
            } else if (node.nodeName == 'DIV' || node.nodeName == 'P') {
                newNode = document.createElement('DIV');
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
        for (let i = 0, j = 0; i < temp.childNodes.length && j < newNode.childNodes.length; ++i, ++j) {
            domRet = this.getCaretNode(newNode.childNodes[j], temp.childNodes[i], caretNode, isTextNode) || domRet;
            if (caretNode == temp.childNodes[i]) {
                return newNode.childNodes[i];
            }
        }
        return domRet;
    }

    addBlock(detail) {
        let getParentBlockNode = function(node) {
            let temp = node;
            while (!isABlockNode(temp)) {
                temp = temp.parentNode;
            }
            return temp;
        }

        let NodeType = detail.nodeName;
        let Info = selections.getSelectionInfo();
        let parentStart = Info.startNode, parentEnd = Info.endNode;
        let isTextSelected = selections.getSelection().toString().length > 0;
        if (parentStart) {
            let tempStartNode = getParentBlockNode(parentStart), tempEndNode = getParentBlockNode(parentEnd);
            let caretNewNodeStart;//  = this.getCaretNode(tempStartNode, tempStartNode, parentStart, (parentStart.nodeName == "#text"));
            let caretNewNodeEnd;// = this.getCaretNode(tempEndNode, tempEndNode, parentEnd, (parentEnd.nodeName == "#text"));
            let Node = tempStartNode;
            while (Node && Node != tempEndNode) {
                let nextNode = Node.nextSibling;
                let newNode = document.createElement(Node.nodeName == NodeType ? "DIV" : NodeType);
                newNode.innerHTML = Node.innerHTML;
                if (Node === tempStartNode) {
                    caretNewNodeStart = this.getCaretNode(newNode, tempStartNode, parentStart, (parentStart.nodeName == "#text"));
                }
                Node.parentNode.replaceChild(newNode, Node);
                Node = nextNode;
            }
            let newNode = document.createElement(Node.nodeName == NodeType ? "DIV" : NodeType);
            newNode.innerHTML = Node.innerHTML;
            caretNewNodeEnd = this.getCaretNode(newNode, tempEndNode, parentEnd, (parentEnd.nodeName == "#text"));
            Node.parentNode.replaceChild(newNode, Node);

            // let caretNewNodeStart = this.getCaretNode(tempStartNode, tempStartNode, parentStart, (parentStart.nodeName == "#text"));
            // let caretNewNodeEnd = this.getCaretNode(tempEndNode, tempEndNode, parentEnd, (parentEnd.nodeName == "#text"));
            selections.setSelectionAt({
                startNode: caretNewNodeStart || Node,
                startOffset: Info.startOffset,
                endNode: caretNewNodeEnd || Node,
                endOffset: Info.endOffset
            });
            // check whether caret set done properly
            if (isTextSelected) {
                const check = selections.getSelectionInfo();
                if (check.startNode == check.endNode && check.startOffset == check.endOffset) {
                    selections.setSelectionAt({
                        startNode: caretNewNodeEnd || Node,
                        startOffset: Info.endOffset,
                        endNode: caretNewNodeStart || Node,
                        endOffset: Info.startOffset
                    });
                }
            }
        }
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
            this.Body.innerHTML = "<div><br></div>";
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
