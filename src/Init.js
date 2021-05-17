import Editor from './Editor/Editor';
import { constructSymbolTable } from './CodeFormatting';
import { initUIMode } from './Mode';
import '../styles/style.css';
import '../styles/theme.css';

export const initEditor = function(enableTools) {
    let enablingTools = {
        bold: {
            hint: "Bold text",
            classname: 'bold',
            display: "<b>B</b>"
        },
        italic: {
            hint: "Italic text",
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
            display: 'H<sub>2</sub>O'
        },
        superscript: {
            hint: 'Superscript',
            classname: 'superscript',
            display: '1<sup>st</sup>'
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
        alignLeft: {
            hint: 'Align text left',
            classname: 'align-left',
            display: '<i class="fa fa-align-left" aria-hidden="true"></i>'
        },
        alignRight: {
            hint: 'Align text right',
            classname: 'align-right',
            display: '<i class="fa fa-align-right" aria-hidden="true"></i>'
        },
        alignCenter: {
            hint: 'Align text center',
            classname: 'align-center',
            display: '<i class="fa fa-align-center" aria-hidden="true"></i>'
        },
        alignJustify: {
            hint: 'Justify text',
            classname: 'align-justify',
            display: '<i class="fa fa-align-justify" aria-hidden="true"></i>'
        },
        math: {
            hint: "Math Symbol",
            classname: "math",
            display: "<span style='font-family: Cambria'>&pi;</span>"
        },
        currency: {
            hint: "Currency Symbol",
            classname: "currency",
            display: "<span style='font-family: Cambria'>$</span>"
        },
        image: {
            hint: 'Insert Image',
            classname: 'image',
            display: '<i class="fa fa-image" aria-hidden="true"></i>'
        }
    }

    let cssLink = document.createElement('LINK');
    cssLink.setAttribute('rel', 'stylesheet');
    cssLink.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
    document.head.appendChild(cssLink);

    if (!Array.isArray(enableTools)) {
        enableTools = [["bold", "italic", "underline", "subscript", "superscript"], 
                       ["blockquote", "header1", "header2"],
                       ["unorderedList", "orderedList"],
                       ["alignLeft", "alignRight", "alignCenter", "alignJustify"],
                       ["math", "currency"],
                        ["link", "image"]];
    } else {
        for (let array of enableTools) {
            if (!Array.isArray(array)) {
                enableTools = [["bold", "italic", "underline", "subscript", "superscript"],
                    ["blockquote", "header1", "header2"],
                    ["unorderedList", "orderedList"],
                    ["alignLeft", "alignRight", "alignCenter", "alignJustify"],
                    ["link", "image"]];
                break;
            }
        }
    }

    let teditors = document.querySelectorAll('.editor');
    teditors.forEach(function (_editor) {
        let options = document.createElement('DIV');
        options.classList.add('options');
        let toolbar = document.createElement('span');

        enableTools.forEach(function (toolBatch) {
            for (let toolInfo of toolBatch) {
                let { hint, classname, display } = enablingTools[toolInfo], 
                    toolContainer = document.createElement('span'),
                    tool = document.createElement('button');

                toolContainer.classList.add('tool');
                tool.classList.add(classname);
                tool.title = hint;
                tool.classList.add('no-highlight');
                tool.innerHTML = display;
                toolContainer.innerHTML = `${tool.outerHTML}`;
                toolbar.appendChild(toolContainer);
            }
            if (toolBatch != enableTools[enableTools.length - 1]) {
                let vertical = document.createElement('SPAN');
                vertical.classList.add('separator');
                toolbar.appendChild(vertical);
            }
        });

        options.appendChild(toolbar);
        _editor.appendChild(options);
        let body = document.createElement("DIV");
        body.setAttribute('contenteditable', 'true');
        body.classList.add('bodyeditable');
        _editor.appendChild(body);

        constructSymbolTable(_editor, 0x2200, 0x22FF, 'math');
        constructSymbolTable(_editor, 0x20A0, 0x20BF, 'currency');
        new Editor(_editor);
        // new ColorPicker(_editor);
    });
    initUIMode();
};