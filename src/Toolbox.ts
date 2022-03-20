import selection from './Selection';
import { getIntersectingFormattingOptions } from './Formatting';
import Editor from './Editor/Editor';

export default class ToolBox {
    editorHandler: Editor = null;
    mainNode: HTMLDivElement = null;
    symbolTable: HTMLElement = null;
    toolbox: HTMLElement = null;
    bodyNode: HTMLElement = null;
    bold: HTMLButtonElement = null;
    italic: HTMLButtonElement = null;
    underline: HTMLButtonElement = null;
    subs: HTMLButtonElement = null;
    sups: HTMLButtonElement = null;
    quote: HTMLButtonElement = null;
    anchor: HTMLButtonElement = null;
    hr: HTMLButtonElement = null;
    header1: HTMLButtonElement = null;
    header2: HTMLButtonElement = null;
    Alignleft: HTMLButtonElement = null;
    Alignright: HTMLButtonElement = null;
    Aligncenter: HTMLButtonElement = null;
    Alignjustify: HTMLButtonElement = null;
    unorderedList: HTMLButtonElement = null;
    orderedList: HTMLButtonElement = null;
    math: HTMLButtonElement = null;
    currency: HTMLButtonElement = null;
    elementReferences: any = null;
    alignment: any = null

    /**
     * @details Constructor
     * @param  Node 
     * @param  mainEditor 
     */
    constructor(Node, mainEditor) {
        this.editorHandler = mainEditor;
        this.mainNode = Node;
        this.toolbox = Node.querySelector('.options');
        this.bodyNode = Node.querySelector('.bodyeditable');

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
            this.editorHandler.addInline({
                cmd: 'insertHTML',
                valArg: '<hr class="hline" style="width: 80%; height: 0; border: 0; border-bottom: 1px solid #ccc;" />'
            });
        }, event));

        this.anchor = Node.querySelector('.link');
        this.anchor && (this.anchor.onclick = event => this.applyTools(event => {
            const parent = selection.getCurrentNodeFromCaretPosition();
            if (parent && parent.nodeName === 'A') {
                this.editorHandler.addInline({
                    cmd: 'unlink',
                    showDef: false,
                });
            } else {
                const url = prompt('Enter the URL');
                console.log(url);
                if (url) {
                    this.editorHandler.addInline({
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
            this.editorHandler.addInline({
                cmd: 'justifyLeft'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.Alignright = Node.querySelector('.align-right');
        this.Alignright && (this.Alignright.onclick = event => this.applyTools(event => {
            this.editorHandler.addInline({
                cmd: 'justifyRight'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.Aligncenter = Node.querySelector('.align-center');
        this.Aligncenter && (this.Aligncenter.onclick = event => this.applyTools(event => {
            this.editorHandler.addInline({
                cmd: 'justifyCenter'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.Alignjustify = Node.querySelector('.align-justify');
        this.Alignjustify && (this.Alignjustify.onclick = event => this.applyTools(event => {
            this.editorHandler.addInline({
                cmd: 'justifyFull'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.unorderedList = Node.querySelector('.ulist');
        this.unorderedList && (this.unorderedList.onclick = event => this.applyTools(event => {
            // this.editorHandler.addList({ nodeName: 'UL' });
        }, event));

        this.orderedList = Node.querySelector('.olist');
        this.orderedList && (this.orderedList.onclick = event => this.applyTools(event => {
            // this.editorHandler.addList({ nodeName: 'OL' });
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
        };

        this.alignment = {
            left: this.Alignleft,
            right: this.Alignright,
            center: this.Aligncenter,
            justify: this.Alignjustify
        };
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
                    this.editorHandler.addInline({
                        cmd: details.command
                    });
                    break;
                case 'block':
                    this.editorHandler.applyBlocks({
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
                this.symbolTable = null;
            } else {
                this.constructSymbolTable(editorNode, startRange, endRange);
                this.symbolTable.style.top = `${event.target.offsetTop + 50}px`;
                this.symbolTable.style.left = `${event.target.offsetLeft - this.symbolTable.offsetWidth / 2}px`;
            }
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
        for (let i = start; i <= end; ++i) {
            const symbolButtons = document.createElement('BUTTON');
            symbolButtons.classList.add('symbol-blocks');
            symbolButtons.title = symbolButtons.innerHTML = `&#${i};`;
            table.appendChild(symbolButtons);
            symbolButtons.onclick = event => {
                this.editorHandler.insertString(`&#${i};`);
            }
        }
        editor.appendChild(table);
        this.symbolTable = table;
    }

    /**
     * @details checks whether these events are being called from the given editor or 
     * not.
     * @param call 
     * @param callData 
     */
    applyTools(call, callData) {
        if (typeof call !== 'function') {
            throw (`Wait, the call should be of type callable, not ${typeof (call)}`);
        } else {
            let { startNode } = selection.getSelectionInfo();
            while (startNode.parentNode && startNode !== this.editorHandler.editor) {
                startNode = startNode.parentNode;
            }
            if (this.editorHandler.editor === startNode) {
                call(callData);
            }
        }
    }

    /**
     * @details Remove all button highlights for recomputing 
     * which styles/tags are applied.
     */
    clearAllFormats() {
        [this.elementReferences, this.alignment].forEach(elementReferences => {
            Object.entries(elementReferences).forEach((referenceKey: any) => {
                const [ tagName, reference ] = referenceKey;
                if (reference && reference.classList) {
                    reference.classList.add('no-highlight');
                }
            });
        })
    }

    /**
     * @details The code that evaluates what styles are applied
     * in the current selection. Highlights the format by evaluating
     * intersection of all styles from a given caret selection.
     */
    formatsOnCurrentCaret(): void {
        const nodeArray = this.editorHandler.getAllTextNodeInsideSelection();
        this.clearAllFormats();
        const [ formatApplied, align ] = getIntersectingFormattingOptions(this.editorHandler.editor, nodeArray);
        if (formatApplied.size) {
            formatApplied.forEach(tagName => {
                const elementReference = this.elementReferences[tagName];
                if (elementReference && elementReference.classList) {
                    elementReference.classList.remove('no-highlight');
                }
            });
        }
        if (align) {
            const elementReference = this.alignment[align]; 
            if (elementReference && elementReference.classList) {
                elementReference.classList.remove('no-highlight');
            }
        }
    }
};
