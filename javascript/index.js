// separate script file.
let model = [{
    id: 'bold',
    hint: 'Bold text',
    button: '<b>B</b>'
}, {
    id: 'italic',
    hint: 'Italic text',
    button: '<i>I</i>'
}, {
    id: 'underline',
    hint: 'Underline text',
    button: '<u>U</u>'
}, {
    id: 'subscript',
    hint: 'Subscript',
    button: 'H<sub>2</sub>O'
}, {
    id: 'superscript',
    hint: 'Superscript',
    button: '1<sup>st</sup>'
}, {
    id: 'blockquote',
    hint: 'Blockquote',
    button: '<i class="fa fa-quote-right"></i>'
}, {
    id: 'hr',
    hint: 'Horizontal Line',
    button: '<i class="fa fa-ellipsis-h"></i>'
}, {
    id: 'header-1',
    hint: 'Header 1',
    button: 'H1'
}, {
    id: 'header-2',
    hint: 'Header 2',
    button: 'H2'
}, {
    id: 'ulist',
    hint: 'Unordered List',
    button: '<i class="fa fa-list"></i>'
}, {
    id: 'olist',
    hint: 'Ordered List',
    button: '<i class="fa fa-list-ol"></i>'
}, {
    id: 'link',
    hint: 'Anchor link',
    button: '<i class="fa fa-link"></i>'
}, {
    id: 'align-left',
    hint: 'Align text left',
    button: '<i class="fa fa-align-left" aria-hidden="true"></i>'
}, {
    id: 'align-right',
    hint: 'Align text right',
    button: '<i class="fa fa-align-right" aria-hidden="true"></i>'
}, {
    id: 'align-center',
    hint: 'Align text center',
    button: '<i class="fa fa-align-center" aria-hidden="true"></i>'
}, {
    id: 'align-justify',
    hint: 'Justify text',
    button: '<i class="fa fa-align-justify" aria-hidden="true"></i>'
}, {
    id: 'image',
    hint: 'Insert Image',
    button: '<i class="fa fa-image" aria-hidden="true"></i>'
}
];
window.onload = () => {
    initEditor();
    // let teditors = document.querySelectorAll('.editor');
    // teditors.forEach(function (_editor) {
    //     let options = document.createElement('DIV');
    //     options.classList.add('options');
    //     let center = document.createElement('center');
    //     let toolbar = document.createElement('span');
    //     model.forEach(function (toolInfo) {
    //         let { id, hint, button } = toolInfo;
    //         let toolContainer = document.createElement('span');
    //         toolContainer.classList.add('tool');
    //         let tool = document.createElement('button');
    //         tool.classList.add(id);
    //         tool.title = hint;
    //         tool.classList.add('no-highlight');
    //         tool.innerHTML = button;
    //         toolContainer.innerHTML = `${tool.outerHTML}`;
    //         toolbar.appendChild(toolContainer);
    //     });
    //     options.appendChild(toolbar);
    //     // center.appendChild(options);
    //     _editor.appendChild(options);
    //     let body = document.createElement("DIV");
    //     body.setAttribute('contenteditable', 'true');
    //     body.classList.add('bodyeditable');
    //     _editor.appendChild(body);
    //     new Editor(_editor);
    //     // new ColorPicker(_editor);
    // });
    // initUIMode();

    // window.selections = new Selection();
    // window.navigation = new Navigation();
}