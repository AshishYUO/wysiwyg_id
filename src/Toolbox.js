import Selection from './Selection';
const selections = new Selection();

export default class ToolBox {
    constructor(Node, mainEditor) {
        this.Editor = mainEditor;
        this.toolbox = Node.querySelector('.options');
        this.bodyNode = Node.querySelector('.bodyeditable');
        this.linkContainer = document.createElement('div');
        this.linkContainer.classList.add('link-container', 'hide');

        this.bold = Node.querySelector('.bold');
        this.bold && (this.bold.onclick = event => this.applyTools(event => {
            this.Editor.addInline({
                cmd: 'bold'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.italic = Node.querySelector('.italic');
        this.italic && (this.italic.onclick = event => this.applyTools(event => {
            this.Editor.addInline({
                cmd: 'italic'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.underline = Node.querySelector('.underline');
        this.underline && (this.underline.onclick = event => this.applyTools(event => {
            this.Editor.addInline({
                cmd: 'underline'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.subs = Node.querySelector('.subscript');
        this.subs && (this.subs.onclick = event => this.applyTools(event => {
            this.Editor.addInline({
                cmd: 'subscript'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.sups = Node.querySelector('.superscript');
        this.sups && (this.sups.onclick = event => this.applyTools(event => {
            this.Editor.addInline({ 
                cmd: 'superscript'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.quote = Node.querySelector('.blockquote');
        this.quote && (this.quote.onclick = event => this.applyTools(event => {
            this.Editor.addBlock({ nodeName: 'BLOCKQUOTE' });
            this.formatsOnCurrentCaret();
        }, event));

        this.hr = Node.querySelector('.hr');
        this.hr && (this.hr.onclick = event => this.applyTools(event => {
            this.Editor.addInline({
                cmd: 'insertHTML',
                valArg: '<hr class="hline" style="width: 80%; height: 0; border: 0; border-bottom: 1px solid #ccc;" />'
            });
        }, event));

        this.anchor = Node.querySelector('.link');
        this.anchor && (this.anchor.onclick = event => this.applyTools(event => {
            const parent = selections.getCurrentNodeFromCaretPosition();
            if (parent && parent.nodeName === 'A') {
                this.Editor.addInline({
                    cmd: "unlink",
                    showDef: false,
                });
            } else {
                const url = prompt('Enter the URL');
                console.log(url);
                if (url) {
                    this.Editor.addInline({
                        cmd: 'createLink',
                        showDef: false,
                        valArg: url
                    });
                } else {
                    alert('Please enter the link');
                }
            }
            this.formatsOnCurrentCaret();
        }, event));

        this.header1 = Node.querySelector('.header-1');
        this.header1 && (this.header1.onmousedown = event => this.applyTools(event => {
            this.Editor.addBlock({ nodeName: 'H1' });
            this.formatsOnCurrentCaret();
        }, event));

        this.header2 = Node.querySelector('.header-2');
        this.header2 && (this.header2.onmousedown = event => this.applyTools(event => {
            this.Editor.addBlock({ nodeName: 'H2' });
            this.formatsOnCurrentCaret();
        }, event));

        this.Alignleft = Node.querySelector('.align-left');
        this.Alignleft && (this.Alignleft.onclick = event => this.applyTools(event => {
            this.Editor.addInline({
                cmd: 'justifyLeft'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.Alignright = Node.querySelector('.align-right');
        this.Alignright && (this.Alignright.onclick = event => this.applyTools(event => {
            this.Editor.addInline({
                cmd: 'justifyRight'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.Aligncenter = Node.querySelector('.align-center');
        this.Aligncenter && (this.Aligncenter.onclick = event => this.applyTools(event => {
            this.Editor.addInline({
                cmd: 'justifyCenter'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.Alignjustify = Node.querySelector('.align-justify');
        this.Alignjustify && (this.Alignjustify.onclick = event => this.applyTools(event => {
            this.Editor.addInline({
                cmd: 'justifyFull'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.unorderedList = Node.querySelector('.ulist');
        this.unorderedList && (this.unorderedList.onclick = event => this.applyTools(event => {
            this.Editor.addList({ nodeName: 'UL' });
        }, event));

        this.orderedList = Node.querySelector('.olist');
        this.orderedList && (this.orderedList.onclick = event => this.applyTools(event => {
            this.Editor.addList({ nodeName: 'OL' });
        }, event));

        // Handle math symbols
        this.mathsymbols = Node.querySelector('.math');

        this.math_symbol_table = undefined;
        this.mathsymbols && (this.mathsymbols.onclick = event => this.applyTools(event => {
            this.math_symbol_table = this.math_symbol_table || Node.querySelector('.math-table');
            if (this.currency_symbol_table && !this.currency_symbol_table.classList.contains('hide')) {
                this.currency_symbol_table.classList.add('hide');
            }
            this.math_symbol_table.classList.toggle('hide');
            this.math_symbol_table.style.top = `${this.mathsymbols.offsetTop + 50}px`;
            this.math_symbol_table.style.left = `${this.mathsymbols.offsetLeft - this.math_symbol_table.offsetWidth / 2}px`;
        }, event));

        // Handling currency 
        this.currencysymbols = Node.querySelector('.currency');
        
        this.currency_symbol_table = undefined;
        this.currencysymbols && (this.currencysymbols.onclick = event => this.applyTools(event => {
            this.currency_symbol_table = this.currency_symbol_table || Node.querySelector('.currency-table');
            if (this.math_symbol_table && !this.math_symbol_table.classList.contains('hide')) {
                this.math_symbol_table.classList.add('hide');
            }
            this.currency_symbol_table.classList.toggle('hide');
            this.currency_symbol_table.style.top = `${this.currencysymbols.offsetTop + 50}px`;
            this.currency_symbol_table.style.left = `${this.currencysymbols.offsetLeft - this.currency_symbol_table.offsetWidth / 2}px`;
        }, event));

        this.elementReferences = {
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
        this.alignment = {
            left: this.Alignleft,
            right: this.Alignright,
            center: this.Aligncenter,
            justify: this.Alignjustify
        }
    }

    applyTools(call, callData) {
        this.Editor.ifBodyIsEmpty();
        if (typeof call !== 'function') {
            throw (`Wait, the call should be of type callable, not ${typeof (call)}`);
        } else {
            let { startNode } = selections.getSelectionInfo();
            while (startNode.parentNode && startNode !== this.Editor.Body) {
                startNode = startNode.parentNode;
            }
            if (this.Editor.Body === startNode) {
                call(callData);
            }
        }
    }

    clearAllFormats() {
        for (const [tagNames, reference] of Object.entries(this.elementReferences)) {
            if (reference) {
                reference.classList.remove('is-applied');
                reference.classList.add('no-highlight');
            }
        }
        for (const [alignment, reference] of Object.entries(this.alignment)) {
            if (reference) {
                reference.classList.remove('is-applied');
                reference.classList.add('no-highlight');
            }
        }
    }

    formatsOnCurrentCaret() {
        const nodeArray = this.Editor.getAllTextNodeInsideSelection();
        let align = false;
        const formatApplied = {
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
        this.clearAllFormats();
        for (const node of nodeArray) {
            if (align !== undefined) {
                align = false;
            }
            for (const format in formatApplied) {
                formatApplied[format] = false;
            }
            let traverse = node;
            while (traverse !== this.Editor.Body) {
                if (traverse.nodeName in formatApplied) {
                    formatApplied[traverse.nodeName] = true;
                }
                if (traverse.style && traverse.style.textAlign) {
                    align = traverse.style.textAlign;
                }
                traverse = traverse.parentNode;
            }
            for (const formats in formatApplied) {
                if (!formatApplied[formats]) {
                    delete formatApplied[formats];
                }
            }
            if (!align) {
                align = undefined;
            }
            if (!Object.keys(formatApplied).length) {
                break;
            }
        }
        if (Object.keys(formatApplied).length) {
            for (const [tagName, boolValue] of Object.entries(formatApplied)) {
                const elementReference = this.elementReferences[tagName];
                if (boolValue && elementReference && elementReference.classList) {
                    elementReference.classList.add('is-applied');
                    elementReference.classList.remove('no-highlight');
                }
            }
        }
        if (align) {
            const elementReference = this.alignment[align]; 
            if (elementReference && elementReference.classList) {
                elementReference.classList.add('is-applied');
                elementReference.classList.remove('no-highlight');
            }
        }
    }
};
