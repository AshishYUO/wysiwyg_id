import Selection from './Selection';
const selections = new Selection();

export default class ToolBox {
    constructor(Node, mainEditor) {
        this.Editor = mainEditor;
        this.toolbox = Node.getElementsByClassName("options")[0];
        this.bodyNode = Node.getElementsByClassName("bodyeditable")[0];
        this.linkContainer = document.createElement("div");
        this.linkContainer.classList.add("link-container", 'hide');
        // this.linkInp = document.createElement("input");
        // this.linkInp.classList.add("link-input");
        // this.linkInp.setAttribute("type", "text");
        // this.linkInp.setAttribute("placeholder", "Enter the link.");
        // this.linkSave = document.createElement("button");
        // this.linkSave.setAttribute("type", "button");
        // this.linkSave.classList.add('link-save');
        // this.linkSave.innerHTML = "Save";
        // this.linkContainer.append(this.linkInp);
        // this.linkContainer.append(this.linkSave);
        // this.toolbox.appendChild(this.linkContainer);

        this.bold = Node.getElementsByClassName('bold')[0];
        this.bold && (this.bold.onclick = (event) => this.applyTools(function (event) {
            this.Editor.addInline({
                cmd: "bold"
            });
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.italic = Node.getElementsByClassName('italic')[0];
        this.italic && (this.italic.onclick = (event) => this.applyTools(function (event) {
            this.Editor.addInline({
                cmd: "italic"
            });
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.underline = Node.getElementsByClassName('underline')[0];
        this.underline && (this.underline.onclick = (event) => this.applyTools(function (event) {
            this.Editor.addInline({
                cmd: "underline"
            });
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.subs = Node.getElementsByClassName('subscript')[0];
        this.subs && (this.subs.onclick = (event) => this.applyTools(function (event) {
            this.Editor.addInline({
                cmd: "subscript"
            });
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.sups = Node.getElementsByClassName('superscript')[0];
        this.sups && (this.sups.onclick = (event) => this.applyTools(function (event) {
            this.Editor.addInline({ 
                cmd: "superscript"
            });
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.quote = Node.getElementsByClassName("blockquote")[0];
        this.quote && (this.quote.onclick = (event) => this.applyTools(function (event) {
            this.Editor.addBlock({ nodeName: "BLOCKQUOTE" });
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.hr = Node.getElementsByClassName('hr')[0];
        this.hr && (this.hr.onclick = (event) => this.applyTools(function (event) {
            this.Editor.addInline({
                cmd: "insertHTML",
                valArg: "<hr class=\"hline edit-paragraph\" style=\"width: 80%; height: 0; border: 0; border-bottom: 1px solid #ccc;\" />"
            });
        }.bind(this), event));

        this.anchor = Node.getElementsByClassName('link')[0];
        this.anchor && (this.anchor.onclick = (event) => this.applyTools(function (event) {
            let parent = selections.getCurrentNodeFromCaretPosition();
            if (parent && parent.nodeName === 'A') {
                this.Editor.addInline({
                    cmd: "unlink",
                    showDef: false,
                });
            } else {
                let url = prompt("Enter the URL");
                console.log(url);
                if (url) {
                    this.Editor.addInline({
                        cmd: "createLink",
                        showDef: false,
                        valArg: url
                    });
                } else {
                    alert("Please enter the link");
                }
            }
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.header1 = Node.getElementsByClassName("header-1")[0];
        this.header1 && (this.header1.onmousedown = (event) => this.applyTools(function (event) {
            this.Editor.addBlock({ nodeName: "H1" });
            // this.bodyNode.dispatchEvent(new CustomEvent("add_block", { "detail": "H1" }));
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.header2 = Node.getElementsByClassName("header-2")[0];
        this.header2 && (this.header2.onmousedown = (event) => this.applyTools(function (event) {
            this.Editor.addBlock({ nodeName: "H2" });
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.AlignLeft = Node.getElementsByClassName("align-left")[0];
        this.AlignLeft && (this.AlignLeft.onclick = (event) => this.applyTools(function (event) {
            this.Editor.addInline({
                cmd: "justifyLeft"
            });
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.AlignRight = Node.getElementsByClassName("align-right")[0];
        this.AlignRight && (this.AlignRight.onclick = (event) => this.applyTools(function (event) {
            this.Editor.addInline({
                cmd: "justifyRight"
            });
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.AlignCenter = Node.getElementsByClassName("align-center")[0];
        this.AlignCenter && (this.AlignCenter.onclick = (event) => this.applyTools(function (event) {
            this.Editor.addInline({
                cmd: "justifyCenter"
            });
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.AlignJustify = Node.getElementsByClassName("align-justify")[0];
        this.AlignJustify && (this.AlignJustify.onclick = (event) => this.applyTools(function (event) {
            this.Editor.addInline({
                cmd: "justifyFull"
            });
            this.formatsOnCurrentCaret();
        }.bind(this), event));

        this.unorderedList = Node.getElementsByClassName("ulist")[0];
        this.unorderedList && (this.unorderedList.onclick = (event) => this.applyTools(function (event) {
            this.Editor.addList({ nodeName: "UL" });
        }.bind(this), event));

        this.orderedList = Node.getElementsByClassName("olist")[0];
        this.orderedList && (this.orderedList.onclick = (event) => this.applyTools(function (event) {
            this.Editor.addList({ nodeName: "OL" });
        }.bind(this), event));

        // Handle math symbols
        this.mathsymbols = Node.getElementsByClassName('math')[0];
        this.math_symbol_table = undefined;
        this.mathsymbols && (this.mathsymbols.onclick = (event) => this.applyTools(function (event) {
            this.math_symbol_table = this.math_symbol_table || Node.querySelector(".math-table");
            if (this.currency_symbol_table && !this.currency_symbol_table.classList.contains('hide')) {
                this.currency_symbol_table.classList.add('hide');
            }
            this.math_symbol_table.classList.toggle('hide');
            this.math_symbol_table.style.top = `${this.mathsymbols.offsetTop + 50}px`;
            this.math_symbol_table.style.left = `${this.mathsymbols.offsetLeft - this.math_symbol_table.offsetWidth / 2}px`;
        }.bind(this), event));

        // Handling currency 
        this.currencysymbols = Node.getElementsByClassName('currency')[0];
        this.currency_symbol_table = undefined;
        this.currencysymbols && (this.currencysymbols.onclick = (event) => this.applyTools(function (event) {
            this.currency_symbol_table = this.currency_symbol_table || Node.querySelector(".currency-table");
            if (this.math_symbol_table && !this.math_symbol_table.classList.contains('hide')) {
                this.math_symbol_table.classList.add('hide');
            }
            this.currency_symbol_table.classList.toggle('hide');
            this.currency_symbol_table.style.top = `${this.currencysymbols.offsetTop + 50}px`;
            this.currency_symbol_table.style.left = `${this.currencysymbols.offsetLeft - this.currency_symbol_table.offsetWidth / 2}px`;
        }.bind(this), event));

        this.objRefs = {
            B: this.bold, 
            STRONG: this.bold, 
            I: this.italic, 
            EM: this.italic, 
            U: this.underline, 
            SUB: this.subs, 
            SUP: this.sups,
            BLOCKQUOTE: this.quote, 
            A: this.anchor, 
            H1: this.header1, 
            H2: this.header2, 
            UL : this.unorderedList, 
            OL: this.orderedList
        }
    }

    applyTools(call, callData) {
        this.Editor.IfBodyIsEmpty();
        if (typeof call !== 'function') {
            throw (`Wait, the call should be of type callable, not ${typeof (call)}`);
        } else {
            let select = selections.getSelectionInfo();
            let { startNode } = select;
            while (startNode !== this.Editor.Body && (startNode.nodeName == '#text' || (startNode.classList && startNode.classList.contains('bodyeditable') === false))) {
                startNode = startNode.parentNode;
            }
            if (this.Editor.Body === startNode) {
                call(callData);
            }
        }
    }

    formatsOnCurrentCaret() {
        let nodeArray = this.Editor.getAllTextNodeInsideSelection();
        let formatApplied = {
            B: false,
            I: false,
            U: false,
            SUB: false,
            SUP: false,
            H1: false,
            H2: false,
            BLOCKQUOTE: false,
            A: false,
            OL: false,
            UL: false
        }
        let Align = false;
        let size = 11;
        for (let obj in this.objRefs) {
            let tmpRef = this.objRefs[obj];
            tmpRef && tmpRef.classList && tmpRef.classList.remove('is-applied');
            tmpRef && tmpRef.classList && tmpRef.classList.add('no-highlight');
        }
        for (let alignType of ["Left", "Right", "Center", "Justify"]) {
            let tmpRef = this[`Align${alignType}`];
            tmpRef && tmpRef.classList && tmpRef.classList.remove('is-applied');
            tmpRef && tmpRef.classList && tmpRef.classList.add('no-highlight');
        }
        for (let node of nodeArray) {
            if (Align !== undefined) {
                Align = false;
            }
            for (let formats in formatApplied) {
                formatApplied[formats] = false;
            }
            while (node !== this.Editor.Body) {
                if (this.objRefs[node.nodeName] && node.nodeName in formatApplied) {
                    formatApplied[node.nodeName] = true;
                }
                if (node.style && node.style.textAlign) {
                    Align = node.style.textAlign;
                }
                node = node.parentNode;
            }
            for (let formats in formatApplied) {
                if (formatApplied[formats] == false) {
                    delete formatApplied[formats];
                    --size;
                }
            }
            if (size == 0) {
                break;
            } 
            if (Align === false) {
                Align = undefined;
            }
        }
        if (size > 0) {
            for (let format in formatApplied) {
                if (this.objRefs[format]) {
                    let tmpRef = this.objRefs[format];
                    tmpRef && tmpRef.classList && tmpRef.classList.add('is-applied');
                    tmpRef && tmpRef.classList && tmpRef.classList.remove('no-highlight');
                }
            }
        }
        if (Align !== undefined) {
            const capitalize = (s) => {
                if (typeof s !== 'string') return ''
                return s.charAt(0).toUpperCase() + s.slice(1)
            }
            let tmpRef = this[`Align${capitalize(Align)}`];
            tmpRef && tmpRef.classList && tmpRef.classList.add('is-applied');
            tmpRef && tmpRef.classList && tmpRef.classList.remove('no-highlight');
        }
    }
};
