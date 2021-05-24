export const PasteFormattingOptions = {
    DIV: function (oldNode, newNode) { 

    }, 
    UL: function (oldNode, newNode) { },
    OL: function (oldNode, newNode) { }, 
    A: function (oldNode, newNode) {
        for (let attribute of ['href', 'alt', "title"]) {
            newNode.setAttribute(attribute, oldNode.getAttribute(attribute) || oldNode.getAttribute("href"));
        }
    },
    LI: function (oldNode, newNode) {
        if (oldNode.parentNode && !(oldNode.parentNode.nodeName == 'UL' || oldNode.parentNode.nodeName == 'OL')) {
            oldNode.parentNode.removeChild(oldNode);
        }
    },
    CODE: function(oldNode, newNode) { }, 
    PRE: function (oldNode, newNode) { 
        // console.log("Here");
        let node = document.createTextNode(oldNode.innerText);
        // newNode.innerHTML = getKeyword(node.textContent);
        newNode.innerText = node.textContent;
        newNode.setAttribute("style", "white-space: pre-wrap;");
        return 1;
    },
    STRONG: function(oldNode, newNode) { },
    B: function (oldNode, newNode) { },
    I: function (oldNode, newNode) { },
    U: function (oldNode, newNode) { },
    SUB: function (oldNode, newNode) { },
    SUP: function (oldNode, newNode) { },
    EM: function (oldNode, newNode) { },
    IMG: function (oldNode, newNode) { 
        newNode.setAttribute('src', oldNode.getAttribute("src"));
        if (newNode.hasAttribute('alt')) {
            newNode.setAttribute('alt', oldNode.getAttribute("alt"));
        }
    }
}

export const constructSymbolTable = function(editor, start, end, type) {
    var table = document.createElement('DIV');
    table.classList.add('symbol-table')
    table.classList.add(`${type}-table`);
    table.classList.add('hide');
    for (let i = start; i <= end; ++i) {
        var symbolblock = document.createElement('BUTTON');
        symbolblock.classList.add('symbol-blocks');
        symbolblock.style.fontFamily = 'Cambria';
        symbolblock.title = `&#${i};`;
        symbolblock.innerHTML = `&#${i};`;
        table.appendChild(symbolblock);
    }
    let symbol = editor.querySelector(`.${type}`);
    if (symbol) {
        symbol.append(table);
        for (let x of symbol.querySelectorAll('.symbol-blocks')) {
            x.onclick = (event) => document.execCommand('insertHTML', false, x.innerHTML);
        }
    }
};
