interface IElem {
    get: () => Node,
    id: (_: string) => this,
    attr: (k: string, val: string) => this,
    evt: (
        eventName: string,
        fn: (_: Event, _1?: HTMLElement) => void,
        options?: boolean | AddEventListenerOptions
    ) => this,
    attrs: (attrs: Array<[_attrkey: string, _attrvalue: string]>) => this,
    cls: (className: string) => this,
    innerText: (text: string) => this,
    innerHtml: (text: string) => this,
    classes: (classNames: string[]) => this,
    childNodes: (elems: (Node | IElem)[]) => this,
    inner: (elems: (HTMLElement | IElem)[]) => this,
    style: (styleStr: string) => this,
    inputType?: (_: string) => IInpElem,
    checkbox?: () => IInpElem,
    text?: () => IInpElem,
    checked: (set: boolean) => IInpElem,
    check?: () => IInpElem,
    nocheck?: () => IInpElem,
    spellcheck: (set: boolean) => IInpTextElem,
    readonly: (set: boolean) => IInpTextElem,
    read?: () => IInpElem,
    noread?: () => IInpElem,
    spellchk?: () => IInpElem,
    nospellchk?: () => IInpElem,
    placeholder: (str: string) => IInpTextElem,
    appendChild: (_: Node) => IElem,
    append: (_: Node) => IElem,
    appendTo: (_: Node) => IElem,
    tcls: (_: string) => IElem,
    bcls: (clsarr: string[]) => IElem
    nextTo: (_: Node) => IElem,
    before: (_: Node) => IElem
}

interface IInpElem extends IElem {
    checked: (_: boolean) => IInpElem,
    spellcheck: (_: boolean) => IInpElem,
    readonly: (set: boolean) => IInpTextElem,
    placeholder: (str: string) => IInpTextElem,
}

interface IInpTextElem extends IElem {
    spellcheck: (_: boolean) => IInpElem,
    readonly: (set: boolean) => IInpTextElem,
    placeholder: (str: string) => IInpTextElem,
}

class PatInternal {}

type NodePat = PatInternal;

export const _: NodePat = PatInternal;

type Pat = NodePat[] | Pat[];

/**
 * @description Utility to destructure children of a node
 * @param node node to destructure
 * @param pattern Array like structure as a hint for destructuring
 * @returns Array with hierarchy to children of `node` 
 */
export function des(node: HTMLElement, nodeChildrenPatter: Pat): any {
    const pat = [];
    nodeChildrenPatter.forEach((placeholder, index: number) => {
        if (node.children.item(index) && placeholder) {
            pat.push(Array.isArray(placeholder) ? 
                des(node.children.item(index) as HTMLElement, placeholder) : 
                node.children.item(index));
        }
    });
    return pat;
}

export function id(node: HTMLElement, _id: string): HTMLElement | undefined {
    for (const elem of [...node.children].map(elem => elem as HTMLElement)) {
        if (elem.id === _id) {
            return elem;
        } else if (elem.children.length > 0) {
            const innerElem = id(elem as HTMLElement, _id);
            if (innerElem) {
                return innerElem;
            }
        }
    }
}

export function elquery<
    Return extends HTMLElement,
    T extends HTMLElement | Document = Document,
>(
    query: string,
    node = document, 
): Return | null 
{
    return (node || document).querySelector(query) as Return;
}


export function elqueryAll<T extends HTMLElement | Document>(
    query: string,
    node: T, 
): NodeListOf<HTMLElement> | null 
{
    return node.querySelectorAll(query);
}

export function ids(node: HTMLElement, ..._ids: string[]): (HTMLElement | undefined)[] {
    return _ids.map(_id => id(node, _id));
}

/**
 * Element generator, and helper
 * @param tag 
 */
export function el<T extends HTMLElement>(tag: string | T) { 
    const currentWorkingElement = typeof tag === 'string' ? document.createElement(tag) : tag

    const helper = {
        cls (cls: string) {
            currentWorkingElement.classList.add(cls);
            return this;
        },

        id (id: string) {
            currentWorkingElement.id = id;
            return this;
        },

        attr (attributeKey: string, attributeValue: string) {
            currentWorkingElement.setAttribute(attributeKey, attributeValue);
            return this;
        },

        style(str: string) {
            currentWorkingElement.setAttribute('style', str);
            return this;
        },

        evt(
            eventName: string,
            fn: (_: Event, _1?: HTMLElement) => void,
            options?: boolean | AddEventListenerOptions
        ) {
            currentWorkingElement.addEventListener(eventName, fn, options);
            return this;
        },

        attrs(attrs: Array<[_attrkey: string, _attrvalue: string]>) {
            attrs.forEach(([attrKey, attrValue]: [string, string]) => {
                currentWorkingElement.setAttribute(attrKey, attrValue);
            });
            return this;
        },

        innerText(text: string) {
            currentWorkingElement.innerText = text;
            return this;
        },

        innerHtml(text: string) {
            currentWorkingElement.innerHTML = text;
            return this;
        },

        classes(classNames: string[]) {
            classNames.forEach((className: string) => currentWorkingElement.classList.add(className));
            return this;
        },

        childNodes(elems: (Node | IElem)[]) {
            elems.forEach((elem: Node | IElem) => (
                elem instanceof Node ? currentWorkingElement.append(elem) : currentWorkingElement.append(elem.get())
            ));
            return this;
        },

        inner(elems: (Node | IElem)[]) {
            elems.forEach((elem: any) => (
                (elem instanceof HTMLElement || elem instanceof Node) ? currentWorkingElement.append(elem) : currentWorkingElement.append(elem.get())
            ));
            return this;
        },

        children(elems: (Node | IElem)[]) {
            return this.inner(elems);
        },

        inputType(_: string) {
            (currentWorkingElement as HTMLInputElement).type = _;
            return this;
        },

        checkbox() {
            return this.inputType('checkbox');
        },

        text() {
            return this.inputType('text');
        },

        checked(set: boolean) {
            (currentWorkingElement as HTMLInputElement).checked = set;
            return this;
        },

        check() {
            return this.checked(true);
        },

        nocheck() {
            return this.checked(false);
        },

        readonly(set: boolean) {
            (currentWorkingElement as HTMLInputElement).readOnly = set;
            return this;
        },

        read() {
            return this.readonly(true);
        },
        
        noread() {
            return this.readonly(false);
        },

        spellcheck(set: boolean) {
            (currentWorkingElement as HTMLInputElement).spellcheck = set;
            return this;
        },

        spellchk() {
            return this.spellcheck(true);
        },

        nospellchk() {
            return this.spellcheck(false);
        },

        placeholder(set: string) {
            (currentWorkingElement as HTMLInputElement).placeholder = set;
            return this;
        },

        tcls (cls: string) {
            currentWorkingElement.classList.toggle(cls);
            return this;
        },

        bcls (clsarr: string[]) {
            currentWorkingElement.classList.add(...clsarr);
            return this;
        },

        getnd (): Node {
            return currentWorkingElement as Node;
        },

        getel (): HTMLElement {
            return currentWorkingElement as HTMLElement;
        },

        get<T extends HTMLElement>(): T {
            return currentWorkingElement as T;
        },

        appendTo (someParent: Node) {
            someParent.appendChild(currentWorkingElement);
            return this;
        },

        append (el: Node): IElem {
            return this.appendChild(el);
        },

        replaceWith(someChild: Node) {
            if (someChild.parentNode) {
                someChild.parentNode.replaceChild(
                    currentWorkingElement,
                    someChild
                );
            }
            return this;
        },

        appendChild (el: Node): IElem {
            currentWorkingElement.appendChild(el);
            return this;
        },

        nextTo (someSibling: Node) {
            if (someSibling.parentNode) {
                if (someSibling.nextSibling) {
                    someSibling.parentNode.insertBefore(
                        currentWorkingElement,
                        someSibling.nextSibling
                    );
                } else {
                    someSibling.parentNode.appendChild(
                        currentWorkingElement
                    );
                }
            }
            return this;
        },

        before (someSibling: Node) {
            if (someSibling.parentNode) {
                someSibling.parentNode.insertBefore(
                    currentWorkingElement,
                    someSibling
                );
            }
            return this;
        },
    }

    return helper;
}