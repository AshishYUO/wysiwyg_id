import { Option, Some } from "utils/option";

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
export function des<Pattern>(node: HTMLElement, nodeChildrenPatter: Pat): Pattern {
    const pat: any = [];
    nodeChildrenPatter.forEach((placeholder, index: number) => {
        if (node.children.item(index) && placeholder) {
            pat.push(Array.isArray(placeholder) ? 
                des(node.children.item(index) as HTMLElement, placeholder) : 
                node.children.item(index));
        }
    });
    return pat as Pattern;
}

/**
 * 
 * @param _id ID to search
 * @param node 
 * @returns 
 */
export function elId(
    _id: string,
    node: HTMLElement | Document = document
): Option<HTMLElement>
{
    return Some(document.getElementById(_id));
}

/**
 * Convenience for running a querySelector
 * @param query Selector
 * @param node node to be considered parent
 * @returns Cell containing either value or null
 */
export function elQuery<
    Return extends HTMLElement,
>(
    query: string,
    node: HTMLElement | Document = document, 
): Option<Return>
{
    return Some(node.querySelector(query) as Return);
}


/**
 * Convenience for running a querySelectorAll
 * @param query Selector
 * @param node node to be considered parent
 * @returns Multiple cells either value or null
 */
export function elQueryAll(
    query: string,
    node: HTMLElement | Document = document
): Option<NodeListOf<HTMLElement>> 
{
    return Some(node.querySelectorAll(query));
}

export function elIds(
    node: HTMLElement | Document = document,
    ..._ids: string[]
): (Option<HTMLElement>)[] 
{
    return _ids.map(_id => elId(_id, node));
}

export function txt(
    text: string
): Text {
    return document.createTextNode(text);
}

/**
 * Element generator, and helper
 * @param tag 
 */
export function el<T extends HTMLElement>(tag: string | T) { 
    const currentWorkingElement = typeof tag === 'string' ?
        document.createElement(tag) : 
        tag;

    const helper = {
        /**
         * Add class
         * @returns Self for transformation
         */
        cls (cls: string) {
            currentWorkingElement.classList.add(cls);
            return this;
        },

        /**
         * Remove class
         * @returns Self for transformation
         */
        rcls (cls: string) {
            currentWorkingElement.classList.remove(cls);
            return this;
        },

        /**
         * Set id of the element
         * @returns Self for transformation
         */
        id (id: string) {
            currentWorkingElement.id = id;
            return this;
        },

        /**
         * Add attribute
         * @returns Self for transformation
         */
        attr (attributeKey: string, attributeValue: string = 'true') {
            currentWorkingElement.setAttribute(attributeKey, attributeValue);
            return this;
        },

        style(str: string) {
            currentWorkingElement.setAttribute('style', str);
            return this;
        },

        /**
         * Remove attached event to the element
         * @returns Self for transformation
         */
        evtrm<T extends Event>(
            eventName: string,
            fn: (_: T, _1?: HTMLElement) => void,
            options?: boolean | AddEventListenerOptions
        ) {
            currentWorkingElement.removeEventListener(
                eventName,
                fn as (_: Event, _1?: HTMLElement) => void,
                options
            );
            return this;
        },

        /**
         * Attach event to the element
         * @returns Self for transformation
         */
        evt<T extends Event>(
            eventName: string,
            fn: (_: T, _1?: HTMLElement) => void,
            options?: boolean | AddEventListenerOptions
        ) {
            currentWorkingElement.addEventListener(
                eventName,
                fn as (_: Event, _1?: HTMLElement) => void,
                options
            );
            return this;
        },

        /**
         * Bulk add attributes
         * @returns Self for transformation
         */
        attrs(attrs: Array<[_attrkey: string, _attrvalue: string]>) {
            attrs.forEach(([attrKey, attrValue]: [string, string]) => {
                currentWorkingElement.setAttribute(attrKey, attrValue);
            });
            return this;
        },

        /**
         * Set innerText to node currently held
         * @returns Self for transformation
         */
        innerText(text: string) {
            currentWorkingElement.innerText = text;
            return this;
        },

        /**
         * Set innerHtml to node currently held
         * @returns Self for transformation
         */
        innerHtml(text: string) {
            currentWorkingElement.innerHTML = text;
            return this;
        },

        /**
         * Add childNodes to node that is held by current `el`
         * @returns Self for transformation
         */
        childNodes(elems: (Node | Text | IElem)[]) {
            elems.forEach((elem: Node | Text | IElem) => (
                (elem instanceof HTMLElement || elem instanceof Node || elem instanceof Text) ? 
                    currentWorkingElement.append(elem) : 
                    currentWorkingElement.append(elem.get())
            ));
            return this;
        },

        /**
         * Add children to node that is held by current `el`
         * @returns Self for transformation
         */
        inner(elems: (Node | IElem)[]) {
            elems.forEach((elem: any) => (
                (elem instanceof HTMLElement || elem instanceof Node) ? 
                    currentWorkingElement.append(elem) : 
                    currentWorkingElement.append(elem.get())
            ));
            return this;
        },

        extd(elems: (Node | IElem)[]) {
            return this.inner(elems)
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
            currentWorkingElement.spellcheck = set;
            return this;
        },

        /**
         * Add spellcheck
         * @returns Self for transformation
         */
        spellchk() {
            return this.spellcheck(true);
        },

        /**
         * Add no spellcheck
         * @returns Self for transformation
         */
        nospellchk() {
            return this.spellcheck(false);
        },

        /**
         * Set placeholder for Input Element
         * @returns Self for transformation
         */
        placeholder(set: string) {
            (currentWorkingElement as HTMLInputElement).placeholder = set;
            return this;
        },

        /**
         * Toggle class
         * @returns Self for transformation
         */
        tcls (cls: string) {
            currentWorkingElement.classList.toggle(cls);
            return this;
        },

        /**
         * Bulk add class
         * @returns Self for transformation
         */
        bcls (clsarr: string[]) {
            currentWorkingElement.classList.add(...clsarr);
            return this;
        },

        getnd (): Node {
            return currentWorkingElement as Node;
        },

        /**
         * Returns the value transformed by `el`
         * @returns Current node that holds by `el` as` HTMLElement`
         */
        getel (): HTMLElement {
            return currentWorkingElement as HTMLElement;
        },

        /**
         * Returns the value as specified `HTMLElement` transformed by `el`
         * @returns Current node that holds by `el`
         */
        get<T extends HTMLElement>(): T {
            return currentWorkingElement as T;
        },

        /**
         * Append currently held element to `someParent` passed to the function
         * @returns Self for transformation
         */
        appendTo (someParent: Node) {
            someParent.appendChild(currentWorkingElement);
            return this;
        },

        /**
         * Append some node to currently held Element
         * @returns Self for transformation
         */
        append (el: Node): IElem {
            return this.appendChild(el);
        },

        /**
         * Replace `someChild` passed to the function with currently held `Element` 
         * @returns Self for transformation
         */
        replaceWith(someChild: Node) {
            if (someChild.parentNode) {
                someChild.parentNode.replaceChild(
                    currentWorkingElement,
                    someChild
                );
            }
            return this;
        },

        /**
         * Append some node to currently held Element
         * @returns Self for transformation
         */
        appendChild (el: Node): IElem {
            currentWorkingElement.appendChild(el);
            return this;
        },
        
        /**
         * Attach currently held node next to `someNode`, turning into 
         * `nextSibling` of `someSibling`.
         * @returns Self for transformation
         */
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

        /**
         * Attach currently held node previous to `someNode`, turning into 
         * `previousSibling` of `someSibling`.
         * @returns Self for transformation
         */
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

/**
 * Element generator, and helper
 * @param tag 
 */
export function eltxt<T extends Text>(tag: string | T) { 
    const currentWorkingElement = typeof tag === 'string' ?
        document.createElement(tag) : 
        tag;

    const helper = {
        innerText(text: string) {
            currentWorkingElement.textContent = text;
            return this;
        },

        childNodes(elems: (Text | IElem)[]) {
            elems.forEach((elem: Text | IElem) => (
                (elem instanceof Text) ? 
                    currentWorkingElement.textContent += (elem) : 
                    currentWorkingElement.textContent += elem.get()
            ));
            return this;
        },

        inner(elems: (Text | IElem)[]) {
            elems.forEach((elem: any) => (
                (elem instanceof Text) ? 
                    currentWorkingElement.textContent += (elem) : 
                    currentWorkingElement.textContent += elem.get()
            ));
            return this;
        },

        getnd (): Node {
            return currentWorkingElement as Node;
        },

        getel (): Text {
            return currentWorkingElement as Text;
        },

        get<T extends HTMLElement>(): T {
            return currentWorkingElement as T;
        },

        appendTo (someParent: Node) {
            someParent.appendChild(currentWorkingElement);
            return this;
        },

        append (el: Node) {
            currentWorkingElement.textContent += el;
            return this;
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

        nextTo (someSibling: Node | Text) {
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

        before (someSibling: Node | Text) {
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
