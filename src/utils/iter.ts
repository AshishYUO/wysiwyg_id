/**
 * Iterate outwards to the parent of each node
 * @param value Value to iterate towards document
 * @returns wrapper for the Iterator
 */
export function iterToPar(value: HTMLElement | Node) {
    return new ParentIterWrapper(value, (par) => par !== null);
}

class ParentIterWrapper {
    constructor(
        private currNode: HTMLElement | Node,
        private until: (_: HTMLElement | Node) => boolean
    ) {} 

    [Symbol.iterator]() {
        return function*(node: ParentIterWrapper) {
            while (node.until(node.currNode)) {
                const value = node.currNode
                node.currNode = node.currNode.parentNode as HTMLElement;
                yield value;
            }
        }(this);
    }

    till(fn: (_: HTMLElement | Node) => boolean) {
        this.until = fn;
        return this;
    }

    /**
     * Returns the last element returned from the iterator
     * @returns The last element from the iterator
     */
    last(): HTMLElement {
        let value = null;
        for (const i of this) {
            value = i;
        }
        return value;
    }
}

/**
 * Iterate outwards to the parent of each node,
 * yielding last invalid value as well.
 * @param value Value to iterate towards document
 * @returns wrapper for the Iterator
 */
export function iterToParIncl(value: HTMLElement | Node) {
    return new ParentIncIterWrapper(value, (par) => par !== null);
}

class ParentIncIterWrapper {
    constructor(
        private currNode: HTMLElement | Node,
        private until: (_: HTMLElement | Node) => boolean
    ) {} 

    [Symbol.iterator]() {
        return function*(node: ParentIncIterWrapper) {
            while (node.until(node.currNode)) {
                const value = node.currNode
                node.currNode = node.currNode.parentNode as HTMLElement;
                yield value;
            }
            yield node.currNode;
        }(this);
    }

    till(fn: (_: HTMLElement | Node) => boolean) {
        this.until = fn;
        return this;
    }

    last(): HTMLElement {
        let value = null;
        for (const i of this) {
            value = i;
        }
        return value;
    }
}


/**
 * Convenient iterator for nodes.
 * @param value Value to iterate towards document
 * @param fn the function that yields the next node based on current node
 * @param incl Flag for inclusive, i.e., include value for which the generator does not
 * yield value further.
 * @returns wrapper for the Iterator
 */
export function nodeIter(
    value: HTMLElement | Node,
    fn: (_: Node) => Node = (_ => _.parentNode),
    incl: boolean = false
) {
    return new NodeIterWrapper(
        value,
        fn,
        incl,
        (par) => par !== null
    );
}

class NodeIterWrapper {
    constructor(
        private currNode: HTMLElement | Node,
        private stride: (_: HTMLElement | Node) => Node,
        private inclusive: boolean = false,
        private until: (_: HTMLElement | Node) => boolean
    ) {} 

    [Symbol.iterator]() {
        return function*(node: NodeIterWrapper) {
            while (node.until(node.currNode)) {
                const value = node.currNode;
                node.currNode = node.stride(node.currNode) as HTMLElement;
                yield value;
            }
            if (node.inclusive) {
                yield node.currNode;
            }
        }(this);
    }

    till(fn: (_: HTMLElement | Node) => boolean) {
        this.until = fn;
        return this;
    }

    last(): HTMLElement {
        let value = null;
        for (const i of this) {
            value = i;
        }
        return value;
    }
}
