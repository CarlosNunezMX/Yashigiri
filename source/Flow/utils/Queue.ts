export class Queue<T> {
    items:T[] = [];
    append(item: T){
        this.items.push(item);
    }
    front = (): T => this.items[0];

    remove_front = () => {
        this.items = this.items.slice(1)
    }
}