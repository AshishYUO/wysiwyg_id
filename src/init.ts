import Editor from './editor/editor';
import { initUIMode } from './mode';
import '../styles/style.css';
import '../styles/theme.css';
import { DOM } from './element/element';
import { el } from 'element/helper';

export const initEditor = (enableTools=undefined) => {
    const enablingTools = {
        bold: {
            hint: 'Bold text',
            classname: 'bold',
            display: '<b>B</b>'
        },
        italic: {
            hint: 'Italic text',
            classname: 'italic',
            display: '<i>I</i>'
        },
        underline: {
            hint: 'Underline text',
            classname: 'underline',
            display: '<u>U</u>'
        },
        subscript: {
            hint: 'Subscript',
            classname: 'subscript',
            display: 'x<sub>2</sub>'
        },
        superscript: {
            hint: 'Superscript',
            classname: 'superscript',
            display: 'x<sup>2</sup>'
        },
        blockquote: {
            hint: 'Blockquote',
            classname: 'blockquote',
            display: '<i class="fa fa-quote-right"></i>'
        },
        horizontalLine: {
            hint: 'Horizontal Line',
            classname: 'hr',
            display: '<i class="fa fa-ellipsis-h"></i>'
        },
        header1: {
            hint: 'Header 1',
            classname: 'header-1',
            display: 'H1'
        },
        header2: {
            hint: 'Header 2',
            classname: 'header-2',
            display: 'H2'
        },
        unorderedList: {
            hint: 'Unordered List',
            classname: 'ulist',
            display: '<i class="fa fa-list"></i>'
        },
        orderedList: {
            hint: 'Ordered List',
            classname: 'olist',
            display: '<i class="fa fa-list-ol"></i>'
        },
        link: {
            hint: 'Anchor link',
            classname: 'link',
            display: '<i class="fa fa-link"></i>'
        },
        'align-left': {
            hint: 'Align text left',
            classname: 'align-left',
            display: '<i class="fa fa-align-left" aria-hidden="true"></i>'
        },
        'align-right': {
            hint: 'Align text right',
            classname: 'align-right',
            display: '<i class="fa fa-align-right" aria-hidden="true"></i>'
        },
        'align-center': {
            hint: 'Align text center',
            classname: 'align-center',
            display: '<i class="fa fa-align-center" aria-hidden="true"></i>'
        },
        'align-justify': {
            hint: 'Justify text',
            classname: 'align-justify',
            display: '<i class="fa fa-align-justify" aria-hidden="true"></i>'
        },
        math: {
            hint: 'Math Symbol',
            classname: 'math',
            display: '<span style="font-family: Cambria">&pi;</span>'
        },
        currency: {
            hint: 'Currency Symbol',
            classname: 'currency',
            display: '<span style="font-family: Cambria">$</span>'
        },
        image: {
            hint: 'Insert Image',
            classname: 'image',
            display: '<i class="fa fa-image" aria-hidden="true"></i>'
        }
    }

    el<HTMLLinkElement>('link')
        .attrs([['rel', 'stylesheet'], ['href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css']])
        .appendTo(document.head);

    if (!Array.isArray(enableTools)) {
        enableTools = [['bold', 'italic', 'underline', 'subscript', 'superscript'], 
            ['blockquote', 'header1', 'header2'],
            // ['unorderedList', 'orderedList'],
            ['align-left', 'align-right', 'align-center', 'align-justify'],
            ['math', 'currency'],
            ['link', 'image']];
    } else {
        for (const toolsArray of enableTools) {
            if (!Array.isArray(toolsArray)) {
                enableTools = [['bold', 'italic', 'underline', 'subscript', 'superscript'], 
                    ['blockquote', 'header1', 'header2'],
                    // ['unorderedList', 'orderedList'],
                    ['align-left', 'align-right', 'align-center', 'align-justify'],
                    ['math', 'currency'],
                    ['link', 'image']];
                break;
            }
        }
    }

    const allEditorDOM = DOM.querySelectorAll('.editor');
    allEditorDOM.forEach((editor: HTMLElement) => {
        /// Create options
        const options = el('div').cls('options').get<HTMLDivElement>();
        const toolbar = el('span').get();

        enableTools.forEach(toolBatch => {
            toolBatch.forEach(toolInfo => {
                const { hint, classname, display } = enablingTools[toolInfo];
                toolbar.appendChild(el('span')
                    .cls('tool')
                    .inner([el('button')
                        .bcls(['no-highlight', classname])
                        .attr('title', hint)
                        .innerHtml(display)
                    ])
                    .get()
                );

                // const tool = DOM.createElement('button');
                // toolContainer.classList.add('tool');
                // tool.classList.add(classname);
                // tool.title = hint;
                // tool.classList.add('no-highlight');
                // tool.innerHTML = display;
                // toolContainer.innerHTML = `${tool.outerHTML}`;
                // toolbar.appendChild(toolContainer);
            });
            if (toolBatch !== enableTools[enableTools.length - 1]) {
                toolbar.appendChild(
                    el('span').cls('separator').get()
                );
            }
        });

        options.appendChild(toolbar);
        editor.appendChild(options);
        editor.appendChild(el('div').attr('contenteditable', 'true').cls('bodyeditable').get());
        // const body = ;
        // body.setAttribute('contenteditable', 'true');
        // body.classList.add('bodyeditable');
        // editor.appendChild(body);
        
        new Editor(editor);
    });
    initUIMode();
};
