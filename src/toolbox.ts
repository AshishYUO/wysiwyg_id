import selection from './selection';
import { getIntersectingFormattingOptions } from './formatting';
import Editor from './editor/editor';
import { el, elQuery } from 'element/helper';
import { nodeIter } from 'utils/iter';
import { Option, Some } from 'utils/option';

export default class ToolBox {
    editor: Editor;
    mainNode: HTMLDivElement;
    symbolTable: HTMLElement;
    toolbox: HTMLElement;
    bodyNode: HTMLElement;
    bold: Option<HTMLButtonElement>;
    italic: Option<HTMLButtonElement>;
    underline: Option<HTMLButtonElement>;
    subs: Option<HTMLButtonElement>;
    sups: Option<HTMLButtonElement>;
    quote: Option<HTMLButtonElement>;
    anchor: Option<HTMLButtonElement>;
    hr: Option<HTMLButtonElement>;
    header1: Option<HTMLButtonElement>;
    header2: Option<HTMLButtonElement>;
    alignLeft: Option<HTMLButtonElement>;
    alignRight: Option<HTMLButtonElement>;
    alignCenter: Option<HTMLButtonElement>;
    alignJustify: Option<HTMLButtonElement>;
    unorderedList: Option<HTMLButtonElement>;
    orderedList: Option<HTMLButtonElement>;
    math: Option<HTMLButtonElement>;
    currency: Option<HTMLButtonElement>;
    elementReferences: any = null;
    alignment: any = null

    /**
     * @details Constructor
     * @param  Node 
     * @param  mainEditor 
     */
    constructor(Node: HTMLElement, mainEditor) {
        this.editor = mainEditor;
        this.mainNode = Node as HTMLDivElement;
        this.toolbox = elQuery('.options').get();
        this.bodyNode = elQuery('.bodyeditable').get();

        this.bold = elQuery<HTMLButtonElement>('.bold', Node).map(btn => {
            btn.onclick = _ => this.executeCommand({ command: 'bold', type: 'inline' });
            return btn;
        });

        this.italic = elQuery<HTMLButtonElement>('.italic', Node).map(btn => {
            btn.onclick = _ => this.executeCommand({ command: 'italic', type: 'inline' });
            return btn
        });

        this.underline = elQuery<HTMLButtonElement>('.underline', Node).map(btn => {
            btn.onclick = _ => this.executeCommand({ command: 'underline', type: 'inline' })
            return btn;
        });

        this.subs = elQuery<HTMLButtonElement>('.subscript', Node).map(btn => {
            btn.onclick = _ => this.executeCommand({ command: 'subscript', type: 'inline' })
            return btn;
        });

        this.sups = elQuery<HTMLButtonElement>('.superscript', Node).map(btn => {
            btn.onclick = _ => this.executeCommand({ command: 'superscript', type: 'inline' })
            return btn;
        });

        this.quote = elQuery<HTMLButtonElement>('.blockquote', Node).map(btn => {
            btn.onclick = _ => this.executeCommand({ command: 'BLOCKQUOTE', type: 'block' })
            return btn;
        });

        this.hr = elQuery<HTMLButtonElement>('.hr', Node).map(btn => {
            btn.onclick = evt => (this.applyTools(event => {
                this.editor.addInline({
                    cmd: 'insertHTML',
                    valArg: '<hr class="hline" style="width: 80%; height: 0; border: 0; border-bottom: 1px solid #ccc;" />'
                })
            }, evt));
            return btn;
        });

        this.anchor = elQuery('.link');
        (this.anchor.get().onclick = event => this.applyTools(event => {
            selection.getCurrentNodeFromCaretPosition().do(parent => {
                if (parent && parent.nodeName === 'A') {
                    this.editor.addInline({ cmd: 'unlink', showDef: !!0 });
                } else {
                    let valArg: string;
                    if (valArg = prompt('Enter the URL')) {
                        this.editor.addInline({
                            cmd: 'createLink',
                            showDef: !!0,
                            valArg
                        });
                    } else {
                        alert('Please enter the link');
                    }
                }
                this.formatsOnCurrentCaret();
            });
        }, event));

        this.header1 = elQuery<HTMLButtonElement>('.header-1', Node).map(btn => {
            btn.onclick = _ => this.executeCommand({
                command: 'H1',
                type: 'block'
            });
            return btn;
        });

        this.header2 = elQuery<HTMLButtonElement>('.header-2', Node).map(btn => {
            btn.onclick = _ => this.executeCommand({
                command: 'H2',
                type: 'block'
            });
            return btn;
        });

        this.alignLeft = elQuery<HTMLButtonElement>('.align-left').map(btn => {
            btn.onclick = event => this.applyTools(event => {
                this.editor.addInline({
                    cmd: 'justifyLeft'
                });
                this.formatsOnCurrentCaret();
            }, event);
            return btn;
        });

        this.alignRight = elQuery('.align-right');
        this.alignRight.get().onclick = event => this.applyTools(event => {
            this.editor.addInline({
                cmd: 'justifyRight'
            });
            this.formatsOnCurrentCaret();
        }, event);

        this.alignCenter = elQuery('.align-center');
        this.alignCenter.get().onclick = event => this.applyTools(event => {
            this.editor.addInline({
                cmd: 'justifyCenter'
            });
            this.formatsOnCurrentCaret();
        }, event);

        this.alignJustify = elQuery<HTMLButtonElement>('.align-justify').map(btn => {;
            btn.onclick = event => this.applyTools(event => {
                this.editor.addInline({
                    cmd: 'justifyFull'
                });
                this.formatsOnCurrentCaret();
            }, event);
            return btn;
        })

        this.unorderedList = elQuery<HTMLButtonElement>('.ulist').map(btn => {
            btn.onclick = event => this.applyTools(event => {}, event);
            return btn;
        });

        this.orderedList = elQuery<HTMLButtonElement>('.olist').map(btn => {
            btn.onclick = event => this.applyTools(event => {}, event);
            return btn;
        });

        // Handle math symbols
        this.math = elQuery<HTMLButtonElement>('.math').map(btn => {
            btn.onclick = event => this.enableBox(Node, 0x2200, 0x22FF, event);
            return btn;
        });
        // Handling currency 
        this.currency = elQuery<HTMLButtonElement>('.currency').map(btn => {
            btn.onclick = event => this.enableBox(Node, 0x20A0, 0x20BF, event);
            return btn;
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
        const { command: cmd, type } = details;
        this.applyTools(event => {
            switch(type) {
                case 'inline':
                    this.editor.addInline({ cmd });
                    break;
                case 'block':
                    this.editor.applyBlocks({ nodeName: cmd });
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
                .evt('click', (e, curr) => this.editor.insertString(`&#${i};`))
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
    applyTools(call: (some: any) => void, callData) {
        selection.getSelectionInfo().do(({ startNode }) => {
            let par = nodeIter(startNode, n => n.parentNode, true)
                .till(n => n.parentNode && n !== this.editor.editor)
                .last();

            if (this.editor.editor === par) {
                call(callData);
            }
        });
    }

    /**
     * @details Remove all button highlights for recomputing 
     * which styles/tags are applied.
     */
    clearAllFormats() {
        Object.entries(this.elementReferences)
            .concat(Object.entries(this.alignment))
            .forEach(([_, references]: [string, any]) => {
                references.do(value => el(value).cls('no-highlight'));
            });
    }

    /**
     * @details The code that evaluates what styles are applied
     * in the current selection. Highlights the format by evaluating
     * intersection of all styles from a given caret selection.
     */
    formatsOnCurrentCaret(): void {
        this.clearAllFormats();
        const nodeArray = this.editor.getAllTextNodeInsideSelection();
        const [formatApplied, align] = getIntersectingFormattingOptions(
            this.editor.editor,
            nodeArray
        );

        formatApplied.forEach(tagName => {
            this.elementReferences[tagName].do(btn => {
                el(btn).rcls('no-highlight');
            });
        });

        if (align) {
            this.alignment[align].do(btn => {
                el(btn).rcls('no-highlight');
            });
        }
    }
};
