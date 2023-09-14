
export type None = undefined | null;

export function Some<T>(value: T): Opt<T> {
    return new Opt(value);
}

export class Opt<T> {
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
     * @returns Opt
     */
    map<U>(fn: (_: T) => U): Opt<U> {
        if (this.isSome()) {
            return new Opt<U>(fn(this.some));
        }
        return new Opt<U>(undefined);
    }

    /**
     * 
     */
    mapOr<U>(fn: (_: T) => U, def: U): Opt<U> {
        if (this.isSome()) {
            return new Opt<U>(fn(this.some));
        }
        return new Opt<U>(def);
    }

    /**
     * perform operation if value is valid
     * @param fn function to perform
     * @returns 
     */
    do<U>(
        fn: (_: T) => void
    ) {
        if (this.isSome()) {
            fn(this.some);
        }
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

    run<U>(
        fn: (_: T) => U
    ): U | null {
        if (this.isSome()) {
            return fn(this.some);
        }
        return null;
    }
}
