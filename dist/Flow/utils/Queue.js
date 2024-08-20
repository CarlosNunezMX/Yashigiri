export class Queue {
    items = [];
    append(item) {
        this.items.push(item);
    }
    front = () => this.items[0];
    remove_front = () => {
        this.items = this.items.slice(1);
    };
}
