import Selection from './Selection';
const selections = new Selection();

export default class ToolBox {
    /**
     * @details Constructor
     * @param  Node 
     * @param  mainEditor 
     */
    constructor(Node, mainEditor) {
        this.Editor = mainEditor;
        this.mainNode = Node;
        this.toolbox = Node.querySelector('.options');
        this.bodyNode = Node.querySelector('.bodyeditable');
        this.linkContainer = document.createElement('div');
        this.linkContainer.classList.add('link-container', 'hide');

        this.bold = Node.querySelector('.bold');
        if (this.bold) {
            this.bold.onclick = event => this.executeCommand({
                command: 'bold',
                type: 'inline'
            });
        }

        this.italic = Node.querySelector('.italic');
        if (this.italic) {
            this.italic.onclick = event => this.executeCommand({
                command: 'italic',
                type: 'inline'
            });
        }

        this.underline = Node.querySelector('.underline');
        if (this.underline) {
            this.underline.onclick = event => this.executeCommand({
                command: 'underline',
                type: 'inline'
            });
        }

        this.subs = Node.querySelector('.subscript');
        if (this.subs) {
            this.subs.onclick = event => this.executeCommand({
                command: 'subscript',
                type: 'inline'
            });
        }

        this.sups = Node.querySelector('.superscript');
        if (this.sups) {
            this.sups.onclick = event => this.executeCommand({
                command: 'superscript',
                type: 'inline'
            });
        }

        this.quote = Node.querySelector('.blockquote');
        if (this.quote) {
            this.quote.onclick = event => this.executeCommand({
                command: 'BLOCKQUOTE',
                type: 'block'
            });
        }
        
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
        if (this.header1) {
            this.header1.onclick = event => this.executeCommand({
                command: 'H1',
                type: 'block'
            });
        }

        this.header2 = Node.querySelector('.header-2');
        if (this.header2) {
            this.header2.onclick = event => this.executeCommand({
                command: 'H2',
                type: 'block'
            });
        }

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
        this.math = Node.querySelector('.math');
        if (this.math) {
            this.math.onclick = event => this.enableBox(Node, 0x2200, 0x22FF, event);
        }
        // Handling currency 
        this.currency = Node.querySelector('.currency');
        if (this.currency) {
            this.currency.onclick = event => this.enableBox(Node, 0x20A0, 0x20BF, event);
        }

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
    /**
     * @details Execute command on editor based on mentioned details
     * @param details object showing details.
     * @returns none.
     */
    executeCommand(details) {
        this.applyTools(event => {
            switch(details.type) {
                case 'inline':
                    this.Editor.addInline({
                        cmd: details.command
                    });
                    break;
                case 'block':
                    this.Editor.addBlock({
                        nodeName: details.command
                    });
                    break;
                default:
                    break;
            }
            this.formatsOnCurrentCaret();
        }, details);
    }

    /**
     * @details Enable window for selecting special characters.
     * @param editorNode main editor node
     * @param startRange range from which these characters start
     * @param endRange last unicode character value
     * @param event a callback event data passed.
     */
    enableBox(editorNode, startRange, endRange, event) {
        this.applyTools(event => {
            if (this.symbolTable) {
                this.symbolTable.remove();
            }
            this.constructSymbolTable(editorNode, startRange, endRange);
            if (this.symbolTable && !this.symbolTable.classList.contains('hide')) {
                this.symbolTable.classList.add('hide');
            }
            if (this.symbolTable.classList)
            this.symbolTable.classList.toggle('hide');
            this.symbolTable.style.top = `${event.target.offsetTop + 50}px`;
            this.symbolTable.style.left = `${event.target.offsetLeft - this.symbolTable.offsetWidth / 2}px`;
        }, event);
    }

    /**
     * @details Constructs the symbol table.
     * @param editor main editor node.
     * @param start start value of unicode character
     * @param end end value of unicode character.
     */
    constructSymbolTable (editor, start, end) {
        const table = document.createElement('DIV');
        table.classList.add('symbol-table')
        table.classList.add('hide');
        for (let i = start; i <= end; ++i) {
            const symbolblock = document.createElement('BUTTON');
            symbolblock.classList.add('symbol-blocks');
            symbolblock.title = `&#${i};`;
            symbolblock.innerHTML = `&#${i};`;
            table.appendChild(symbolblock);
        }
        editor.appendChild(table);
        const symbol = table;
        this.symbolTable = table;
        if (symbol) {
            this.symbolTable = symbol;
            for (const symbolButtons of symbol.querySelectorAll('.symbol-blocks')) {
                symbolButtons.onclick = event => {
                    this.Editor.insertString(symbolButtons.innerHTML);
                }
            }
        }
    }

    /**
     * @details checks whether these events are being called from the given editor or 
     * not.
     * @param call 
     * @param callData 
     */
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

    /**
     * @details Remove all button highlights for recomputing 
     * which styles/tags are applied.
     */
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

    /**
     * @details The code that evaluates what styles are applied
     * in the current selection. Highlights the format by evaluating
     * intersection of all styles from a given caret selection.
     */
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
