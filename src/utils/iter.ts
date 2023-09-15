class IterWrapper<T> implements Iterable<T> {
    [Symbol.iterator];
    constructor(
        private iterable?: Iterable<T>
    ) {}

    forEach(fn: (_: T, index?: number) => void) {
        let index = 0;
        for (const value of this) {
            fn(value, index);
            index += 1;
        }
    }

    takeWhile(fn: (_: T, index?: number) => boolean) {
        return function*(container) {
            let index = 0;
            for (const value of container) {
                if (!fn(value, index)) {
                    break;
                }
                index += 1;
                yield value;
            }
        }(this);
    }

    map<U>(fn: (_: T, index?: number) => U) {
        return function*(container) {
            let index = 0;
            for (const value of container) {
                yield fn(value, index);
                index += 1;
            }
        }(this);
    }

    filter(fn: (_: T, index?: number) => boolean) {
        return function*(container) {
            let index = 0;
            for (const value of container) {
                if (fn(value, index)) {
                    yield value;
                }
                index += 1;
            }
        }(this);
    }

    collect(): Array<T> {
        return [...this];
    }
}

/**
 * Iterate outwards to the parent of each node
 * @param value Value to iterate towards document
 * @returns wrapper for the Iterator
 */
export function iterToPar(value: HTMLElement | Node) {
    return new ParentIterWrapper(value, (par) => par !== null);
}

class ParentIterWrapper extends IterWrapper<HTMLElement> {
    constructor(
        private currNode: HTMLElement | Node,
        private until: (_: HTMLElement | Node) => boolean
    ) { 
        super();
        this[Symbol.iterator] = function*() {
            while (this.until(this.currNode)) {
                const value = this.currNode;
                this.currNode = this.currNode.parentNode as HTMLElement;
                yield value;
            }(this)
        }
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
    }getCurrentNodeFromCaretPosition

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

class NodeIterWrapper extends IterWrapper<HTMLElement>  {
    constructor(
        private currNode: HTMLElement | Node,
        private stride: (_: HTMLElement | Node) => Node,
        private inclusive: boolean = false,
        private until: (_: HTMLElement | Node) => boolean
    ) {
        super();
        this[Symbol.iterator] = function*() {
            while (this.until(this.currNode)) {
                const value = this.currNode;
                this.currNode = this.stride(this.currNode) as HTMLElement;
                yield value;
            }
            if (this.inclusive) {
                yield this.currNode;
            }
        };
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
