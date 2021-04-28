class ToolBox {
    constructor(Node) {
        this.toolbox = Node.getElementsByClassName("options")[0];
        this.bodyNode = Node.getElementsByClassName("bodyeditable")[0];
        this.linkContainer = document.createElement("div");
        this.linkContainer.classList.add("link-container", 'hide');
        this.linkInp = document.createElement("input");
        this.linkInp.classList.add("link-input");
        this.linkInp.setAttribute("type", "text");
        this.linkInp.setAttribute("placeholder", "Enter the link.");
        this.linkSave = document.createElement("button");
        this.linkSave.setAttribute("type", "button");
        this.linkSave.classList.add('link-save');
        this.linkSave.innerHTML = "Save";
        this.linkContainer.append(this.linkInp);
        this.linkContainer.append(this.linkSave);
        this.toolbox.appendChild(this.linkContainer);

        this.bold = Node.getElementsByClassName('bold')[0];
        this.bold && (this.bold.onclick = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_inline", {
                "detail": {
                    "cmd": "bold",
                    "showDef": undefined,
                    "valArg": undefined
                }
            }));
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.italic = Node.getElementsByClassName('italic')[0];
        this.italic && (this.italic.onclick = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_inline", {
                "detail": {
                    "cmd": "italic",
                    "showDef": undefined,
                    "valArg": undefined
                }
            }));
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.underline = Node.getElementsByClassName('underline')[0];
        this.underline && (this.underline.onclick = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_inline", {
                "detail": {
                    "cmd": "underline",
                    "showDef": undefined,
                    "valArg": undefined
                }
            }));
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.subs = Node.getElementsByClassName('subscript')[0];
        this.subs && (this.subs.onclick = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_inline", {
                "detail": {
                    "cmd": "subscript",
                    "showDef": undefined,
                    "valArg": undefined
                }
            }));
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.sups = Node.getElementsByClassName('superscript')[0];
        this.sups && (this.sups.onclick = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_inline", { 
                "detail": {
                    "cmd": "superscript", 
                    "showDef": undefined, 
                    "valArg": undefined
                }
            }));
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.quote = Node.getElementsByClassName("blockquote")[0];
        this.quote && (this.quote.onclick = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_block", { "detail": "BLOCKQUOTE" }));
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.hr = Node.getElementsByClassName('hr')[0];
        this.hr && (this.hr.onclick = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_inline", {
                "detail": {
                    "cmd": "insertHTML",
                    "showDef": undefined,
                    "valArg": "<hr class=\"hline edit-paragraph\" style=\"width: 80%; height: 0; border: 0; border-bottom: 1px solid #ccc;\" />"
                }
            }));
        }.bind(this), event));

        this.anchor = Node.getElementsByClassName('link')[0];
        this.anchor && (this.anchor.onclick = (event) => this.applyTools(function (event) {
            let parent = selections.getCurrentNodeFromCaretPosition();
            let selectionLength = selections.getSelection().toString().length;
            if (parent && parent.nodeName === 'A') {
                this.bodyNode.dispatchEvent(new CustomEvent("add_inline", {
                    "detail": {
                        "cmd": "unlink",
                        "showDef": false,
                        "valArg": undefined
                    }
                }));
            } else {
                let url = prompt("Enter the URL");
                console.log(url);
                if (url) {
                    this.bodyNode.dispatchEvent(new CustomEvent("add_inline", {
                        "detail": {
                            "cmd": "createLink",
                            "showDef": false,
                            "valArg": url
                        }
                    }));
                } else {
                    alert("Please enter the link");
                }
            }
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.header1 = Node.getElementsByClassName("header-1")[0];
        this.header1 && (this.header1.onmousedown = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_block", { "detail": "H1" }));
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.header2 = Node.getElementsByClassName("header-2")[0];
        this.header2 && (this.header2.onmousedown = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_block", { "detail": "H2" }));
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.AlignLeft = Node.getElementsByClassName("align-left")[0];
        this.AlignLeft && (this.AlignLeft.onclick = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_inline", {
                "detail": {
                    "cmd": "justifyLeft",
                    "showDef": undefined,
                    "valArg": undefined
                }
            }));
        }.bind(this), event));

        this.AlignRight = Node.getElementsByClassName("align-right")[0];
        this.AlignRight && (this.AlignRight.onclick = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_inline", {
                "detail": {
                    "cmd": "justifyRight",
                    "showDef": undefined,
                    "valArg": undefined
                }
            }));
        }.bind(this), event));

        this.AlignCenter = Node.getElementsByClassName("align-center")[0];
        this.AlignCenter && (this.AlignCenter.onclick = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_inline", {
                "detail": {
                    "cmd": "justifyCenter",
                    "showDef": undefined,
                    "valArg": undefined
                }
            }));
        }.bind(this), event));

        this.Justify = Node.getElementsByClassName("align-justify")[0];
        this.Justify && (this.Justify.onclick = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_inline", {
                "detail": {
                    "cmd": "justifyFull",
                    "showDef": undefined,
                    "valArg": undefined
                }
            }));
        }.bind(this), event));

        this.unorderedList = Node.getElementsByClassName("ulist")[0];
        this.unorderedList && (this.unorderedList.onclick = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_list", { "detail": "ul" }));
        }.bind(this), event));

        this.orderedList = Node.getElementsByClassName("olist")[0];
        this.orderedList && (this.orderedList.onclick = (event) => this.applyTools(function (event) {
            this.bodyNode.dispatchEvent(new CustomEvent("add_list", { "detail": "ol" }));
        }.bind(this), event));

        this.objRefs = {
            "B": this.bold, "I": this.italic, "U": this.underline, "SUB": this.subs, "SUP": this.sups,
            "BLOCKQUOTE": this.quote, "A": this.anchor, "H1": this.header1, "H2": this.header2
        }
    }

    applyTools(call, callData) {
        if (typeof call !== 'function') {
            throw (`Wait, the call should be callable! Not ${typeof (call)}`);
        } else {
            let select = selections.getSelectionInfo();
            let { startNode } = select;
            while (startNode !== this.bodyNode && (startNode.nodeName == '#text' || (startNode.classList && startNode.classList.contains('bodyeditable') === false))) {
                startNode = startNode.parentNode;
            }
            if (this.bodyNode === startNode) {
                call(callData);
            }
        }
    }

    formatsOnCurrentCaret() {
        let node = selections.getCurrentNodeFromCaretPosition();
        for (let obj in this.objRefs) {
            let tmpRef = this.objRefs[obj];
            tmpRef && tmpRef.classList && tmpRef.classList.remove('is-applied');
        }
        if (node) {
            while (node !== this.bodyNode) {
                if (this.objRefs[node.nodeName]) {
                    let objectReference = this.objRefs[node.nodeName];
                    if (objectReference && !objectReference.classList.contains('is-applied')) {
                        objectReference.classList.add('is-applied');
                    }
                }
                node = node.parentNode;
            }
        }
    }
};
