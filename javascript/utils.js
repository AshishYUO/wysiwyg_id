var isABlockNode = function(node) {
    return node && node.nodeName && node.nodeName.match(/H[1-6]/) || node.nodeName.match(/^(BLOCKQUOTE|DIV|OL|UL|PRE|P|DL|ADDRESS|IMG|LI|TABLE|TR)$/);
}

var isAnInlineNode = function(node) {
    return !isABlockNode(node) && node && node.hasOwnProperty('nodeName') && node.nodeName  && node.nodeName !== 'comment';
}
