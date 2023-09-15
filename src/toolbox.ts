import selection from './selection';
import { getIntersectingFormattingOptions } from './formatting';
import Editor from './editor/editor';
import { el, elQuery } from 'element/helper';
import { iterToParIncl } from 'utils/iter';

export default class ToolBox {
    editorHandler: Editor;
    mainNode: HTMLDivElement;
    symbolTable: HTMLElement;
    toolbox: HTMLElement;
    bodyNode: HTMLElement;
    bold: HTMLButtonElement;
    italic: HTMLButtonElement;
    underline: HTMLButtonElement;
    subs: HTMLButtonElement;
    sups: HTMLButtonElement;
    quote: HTMLButtonElement;
    anchor: HTMLButtonElement;
    hr: HTMLButtonElement;
    header1: HTMLButtonElement;
    header2: HTMLButtonElement;
    alignLeft: HTMLButtonElement;
    alignRight: HTMLButtonElement;
    alignCenter: HTMLButtonElement;
    alignJustify: HTMLButtonElement;
    unorderedList: HTMLButtonElement;
    orderedList: HTMLButtonElement;
    math: HTMLButtonElement;
    currency: HTMLButtonElement;
    elementReferences: any = null;
    alignment: any = null

    /**
     * @details Constructor
     * @param  Node 
     * @param  mainEditor 
     */
    constructor(Node: HTMLElement, mainEditor) {
        this.editorHandler = mainEditor;
        this.mainNode = Node as HTMLDivElement;
        this.toolbox = elQuery('.options').get();
        this.bodyNode = elQuery('.bodyeditable').get();

        this.bold = elQuery<HTMLButtonElement>('.bold', Node).doGet(btn => (
            btn.onclick = evt => this.executeCommand({ command: 'bold', type: 'inline' })
        ));

        this.italic = elQuery<HTMLButtonElement>('.italic', Node).doGet(btn => (
            btn.onclick = evt => this.executeCommand({ command: 'italic', type: 'inline' })
        ));

        this.underline = elQuery<HTMLButtonElement>('.underline', Node).doGet(btn => (
            btn.onclick = evt => this.executeCommand({ command: 'underline', type: 'inline' })
        ));

        this.subs = elQuery<HTMLButtonElement>('.subscript', Node).doGet(btn => (
            btn.onclick = evt => this.executeCommand({ command: 'subscript', type: 'inline' })
        ));

        this.sups = elQuery<HTMLButtonElement>('.superscript', Node).doGet(btn => (
            btn.onclick = evt => this.executeCommand({ command: 'superscript', type: 'inline' })
        ));

        this.quote = elQuery<HTMLButtonElement>('.blockquote', Node).doGet(btn => (
            btn.onclick = evt => this.executeCommand({ command: 'BLOCKQUOTE', type: 'block' })
        ));

        this.hr = elQuery<HTMLButtonElement>('.hr', Node).doGet(btn => (
            btn.onclick = evt => (this.applyTools(event => {
                this.editorHandler.addInline({
                    cmd: 'insertHTML',
                    valArg: '<hr class="hline" style="width: 80%; height: 0; border: 0; border-bottom: 1px solid #ccc;" />'
                })
            }, evt)
        )));

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

        this.header1 = elQuery<HTMLButtonElement>('.header-1', Node).doGet(btn => {
            btn.onclick = event => this.executeCommand({
                command: 'H1',
                type: 'block'
            });
        });

        this.header2 = elQuery<HTMLButtonElement>('.header-2', Node).doGet(btn => {
            btn.onclick = event => this.executeCommand({
                command: 'H2',
                type: 'block'
            });
        });

        this.alignLeft = Node.querySelector('.align-left');
        this.alignLeft && (this.alignLeft.onclick = event => this.applyTools(event => {
            this.editorHandler.addInline({
                cmd: 'justifyLeft'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.alignRight = Node.querySelector('.align-right');
        this.alignRight && (this.alignRight.onclick = event => this.applyTools(event => {
            this.editorHandler.addInline({
                cmd: 'justifyRight'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.alignCenter = Node.querySelector('.align-center');
        this.alignCenter && (this.alignCenter.onclick = event => this.applyTools(event => {
            this.editorHandler.addInline({
                cmd: 'justifyCenter'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.alignJustify = Node.querySelector('.align-justify');
        this.alignJustify && (this.alignJustify.onclick = event => this.applyTools(event => {
            this.editorHandler.addInline({
                cmd: 'justifyFull'
            });
            this.formatsOnCurrentCaret();
        }, event));

        this.unorderedList = elQuery<HTMLButtonElement>('.ulist').doGet(btn => {
            btn.onclick = event => this.applyTools(event => {}, event);
        });

        this.orderedList = elQuery<HTMLButtonElement>('.olist').doGet(btn => {
            btn.onclick = event => this.applyTools(event => {}, event);
        });

        // Handle math symbols
        this.math = elQuery<HTMLButtonElement>('.math').doGet(btn => {
            btn.onclick = event => this.enableBox(Node, 0x2200, 0x22FF, event);
        });
        // Handling currency 
        this.currency = elQuery<HTMLButtonElement>('.currency').doGet(btn => {
            btn.onclick = event => this.enableBox(Node, 0x20A0, 0x20BF, event);
        });

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
            left: this.alignLeft,
            right: this.alignRight,
            center: this.alignCenter,
            justify: this.alignJustify
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
        const table = el('div').cls('symbol-table').get();

        for (let i = start; i <= end; ++i) {
            const symbolButtons = el('button')
                .cls('symbol-blocks')
                .attr('title', `&#${i};`)
                .innerHtml(`&#${i};`)
                .evt('click', (e, curr) => this.editorHandler.insertString(`&#${i};`))
                .get();
            
            table.appendChild(symbolButtons);
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
            let { startNode } = selection.getSelectionInfo().get();
            let par = iterToParIncl(startNode)
                .till(n => n.parentNode && n !== this.editorHandler.editor)
                .last();

            if (this.editorHandler.editor === par) {
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
                const [tagName, reference] = referenceKey;
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
        const [formatApplied, align] = getIntersectingFormattingOptions(this.editorHandler.editor, nodeArray);
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
