
export type None = undefined | null;

export function Some<T>(value: T): Option<T> {
    return new Option(value);
}

export function None<T>(): Option<T> {
    return new Option(undefined);
}

export class Option<T> {
    /// Holds some value or nothing.
    some: T | None;

    constructor(value: T | None) { this.some = value }
    /**
     * Returns if it holds value
     * @returns boolean
     */
    isSome() { return !this.isNone(); }
    
    /**
     * Returns if it does not hold
     * @returns boolean
     */
    isNone() { return this.some === undefined || this.some === null; }

    get(): T { return this.some }


    /**
     * Returns if it holds value and fulfils `fn`
     * @param fn function for additional function
     * @returns 
     */
    isSomeAnd(fn: (_?: T) => boolean): boolean {
        return this.isSome() && fn(this.some);
    }

    /**
     * Map from one value to another
     * @param fn function for mapping
     * @returns Option
     */
    map<U>(fn: (_: T) => U): Option<U> {
        if (this.isSome()) {
            return new Option<U>(fn(this.some));
        }
        return new Option<U>(undefined);
    }

    /**
     * 
     */
    mapOr<U>(fn: (_: T) => U, def: U): Option<U> {
        if (this.isSome()) {
            return new Option<U>(fn(this.some));
        }
        return new Option<U>(def);
    }

    /**
     * Perform operation if there is a valid value
     * @param fn function to perform
     * @returns 
     */
    do<U>(
        fn: (_: T) => void
    ) {
        this.isSome() && fn(this.some);
    }

    /**
     * perform operation if value is valid, and returns the value
     * @param fn function to perform
     * @returns 
     */
    doGet<U>(
        fn: (_: T) => void
    ) {
        if (this.isSome()) {
            fn(this.some);
            return this.some;
        }
    }
}
