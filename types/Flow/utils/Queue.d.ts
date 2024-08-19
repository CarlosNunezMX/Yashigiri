export declare class Queue<T> {
    items: T[];
    append(item: T): void;
    front: () => T;
    remove_front: () => void;
}
