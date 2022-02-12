
/**
 * @details Perform list operation in a different file.
 * @param details 
 */
export const addList = (details) => {
    const type = details.nodeName;
    let Node = selection.getCurrentNodeFromCaretPosition();
    if (Node) {
        while (!isABlockNode(this.Body, Node) && Node.parentNode != this.Body) {
            Node = Node.parentNode;
        }
        if (Node !== this.Body) {
            const element = document.createElement(type), list = document.createElement('li');
            list.innerHTML = Node.innerHTML;
            element.append(list);
            if (Node.nodeName !== 'LI') {
                Node.parentNode.replaceChild(element, Node);
            } else {
                Node.innerHTML = element.outerHTML;
            }
        }
    }
}
