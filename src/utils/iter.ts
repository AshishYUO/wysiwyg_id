/**
 * Iterate outwards to the parent of each node
 * @param value Value to iterate towards document
 * @returns wrapper for the Iterator
 */
export function iter_to_par(value: HTMLElement | Node) {
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
 * note that this is inclusive
 * @param value Value to iterate towards document
 * @returns wrapper for the Iterator
 */
export function iter_to_par_incl(value: HTMLElement | Node) {
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
