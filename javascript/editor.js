class Editor {
    constructor(Node) {
        this.editorNode = Node;
        this.Body = Node.getElementsByClassName("bodyeditable")[0];
        this.Body.innerHTML = "<div><br></div>";
        this.Body.onpaste = (event) => {
            if (selections.getSelection().toString().length > 0) {
                selections.getSelection().deleteFromDocument();
            }
            let data = (event.clipboardData || window.clipboardData).getData('text/html');
            let div = document.createElement('DIV');
            div.innerHTML = data;
            div.innerHTML = this.clearNode(div).innerHTML;
            event.preventDefault();
            selections.getSelection().getRangeAt(0).insertNode(div);
        }

        this.image = new ImageBuilder(Node);
        this.tools = new ToolBox(Node);

        this.Body.onmouseup = function (event) {
            this.tools.formatsOnCurrentCaret();
        }.bind(this);

        this.Body.onkeydown = function (event) {
            if (event.key == "Tab") {
                event.preventDefault();
                let textNode = document.createTextNode("\xa0\xa0\xa0\xa0");
                selections.getSelection && selections.getSelection().getRangeAt(0).insertNode(textNode);
                let tab = selections.getSelectionInfo();
                selections.setSelectionAt({
                    startNode: tab.endNode,
                    startOffset: tab.endOffset,
                    endNode: tab.endNode,
                    endOffset: tab.endOffset
                })
            }
            this.tools.formatsOnCurrentCaret();
        }.bind(this);

        this.Body.onkeyup = function (event) {
            this.IfBodyIsEmpty();
        }.bind(this);

        this.Body.addEventListener("add_block", function (event) {
            this.IfBodyIsEmpty();
            let checkCaretNode = function (newNode, temp, caretNode, isTextNode) {
                let domRet;
                for (let i = 0, j = 0; i < temp.childNodes.length && j < newNode.childNodes.length; ++i, ++j) {
                    domRet = checkCaretNode(newNode.childNodes[j], temp.childNodes[i], caretNode, isTextNode) || domRet;
                    if (caretNode == temp.childNodes[i]) {
                        return newNode.childNodes[i];
                    }
                }
                return domRet;
            };
            let NodeType = event.detail;
            let Info = selections.getSelectionInfo();
            let parent = Info.startNode;
            if (parent) {
                let temp = parent;
                let caretNode = temp;
                while (!this.isABlockNode(temp)) {
                    temp = temp.parentNode;
                }
                let Node = document.createElement(temp.nodeName == NodeType ? "DIV" : NodeType);
                Node.innerHTML = temp.innerHTML;
                let caretNewNode = checkCaretNode(Node, temp, caretNode, (caretNode.nodeName == "#text"));

                temp.parentNode.replaceChild(Node, temp);
                selections.setSelectionAt({
                    startNode: caretNewNode || Node,
                    startOffset: Info.startOffset,
                    endNode: caretNewNode || Node,
                    endOffset: Info.endOffset
                });
            }
        }.bind(this));

        this.Body.addEventListener("add_list", function (event) {
            this.IfBodyIsEmpty();
            let type = event.detail;
            let Node = selections.getCurrentNodeFromCaretPosition();
            if (Node) {
                while (Node.parentNode !== this.Body && Node.nodeName != "LI") {
                    Node = Node.parentNode;
                }
                let element = document.createElement(type), list = document.createElement("li");
                list.innerHTML = Node.innerHTML;
                element.append(list);
                if (Node.nodeName !== "LI") {
                    this.Body.replaceChild(element, Node);
                } else {
                    Node.innerHTML = element.outerHTML;
                }
            }
        }.bind(this));

        this.Body.addEventListener("add_inline", function (event) {
            let { cmd, showDef, valArg } = event.detail;
            document.execCommand(cmd, false, valArg);
        });
    }
    // Incomplete: if at least one of the child is a block node, take it out from there.

    isABlockNode(node) {
        return node.nodeName.match(/H[1-6]/) || node.nodeName.match(/^(BLOCKQUOTE|DIV|OL|UL|PRE|P|DL|ADDRESS|IMG|LI)$/);
    }

    clearNode(node) {
        let newNode = document.createElement('DIV');
        if (node.children || typeof (node) === 'object') {
            if (node.nodeName.match(/H[1-6]/) || node.nodeName.match(/^(BLOCKQUOTE|SUB|SUP|B|I|U|EM|STRONG|HR|LI|UL|SPAN|A|IMG|PRE|CODE)$/)) {
                newNode = document.createElement(node.nodeName);
            }
            if (node.nodeName === 'A') {
                newNode.setAttribute('href', node.getAttribute('href'));
                if (newNode.hasAttribute('download')) {
                    newNode.setAttribute('download', node.getAttribute('download'));
                }
            }
            if (node.nodeName == 'IMG') {
                newNode.setAttribute('src', node.getAttribute("src"));
                if (newNode.hasAttribute('alt')) {
                    newNode.setAttribute('alt', node.getAttribute("alt"));
                }
            }
            newNode.innerHTML = node.innerHTML;
            let parentNode = node.parentNode;
            if (parentNode) {
                node.parentNode.replaceChild(newNode, node);
            }
            for (let child in newNode.children) {
                this.clearNode(newNode.children[child]);
            }
        }
        return newNode;
    }

    addParagraphAt(node) {
        let newLine = document.createElement("div");
        newLine.append(document.createElement("br"));
        this.Body.insertBefore(newLine, node.nextSibling);
        selections.setCaretPositionAtNode(newLine);
    }

    IfBodyIsEmpty() {
        if (this.Body.innerHTML == "" || this.Body.innerHTML == "<br>") {
            this.Body.innerHTML = "<div><br></div>";
        }
    }

    getHTMLContent() {
        return this.Body.innerHTML;
    }

    getTextContent() {
        return this.Body.innerText;
    }
};
