export interface IdDict<T> {
    [key: number]: T;
}

// todo redo with hash table
export class List<T> {
    private items: IdDict<T>;
    currentId = 0;

    add(item: T): number {
        const id = this.currentId;
        this.currentId++;
        this.items[id] = item;
        return id;
    }

    del(id: number) {
        delete this.items[id];
    }

    get(id: number) {
        return this.items[id];
    }

    entries(): [number, T][] {
        return Object.keys(this.items).map(key => {
            const id = Number(key);
            return [id, this.items[id]] as [number, T];
        });
    }
}
