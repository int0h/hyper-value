export interface ListItem<T> {
    id: number;
    data: T;
}

// todo redo with hash table
export class List<T> {
    items: ListItem<T>[];
    toDelete: Set<number>;
    currentId = 0;

    add(item: T): number {
        const id = this.currentId;
        this.currentId++;
        this.items.push({id, data: item});
        return id;
    }

    del(id: number) {
        this.toDelete.add(id);

        onNextTick(this.clean);
    }

    get(id: number) {
        return this.items.filter(i => i.id === id)[0].data;
    }

    clean = () => {
        if (this.toDelete.size < 1) {
            return;
        }

        let deletedCount = 0;
        let newItems: ListItem<T>[] = [];

        for (let item of this.items) {
            if (this.toDelete.has(item.id)) {
                deletedCount++;
                continue;
            }
            newItems.push(item);
        }

        if (this.toDelete.size !== deletedCount) {
            throw new Error('Bad list item ID');
        }

        this.toDelete = new Set<number>();
        this.items = newItems;
    }

    entries(): [number, T][] {
        this.clean();

        return this.items.map(item => [item.id, item.data]) as [number, T][];
    }
}

let nextTickTaskList: Function[] = [];

function onNextTick(task: () => void) {
    if (nextTickTaskList.length === 0) {
        setTimeout(() => {
            for (let task of nextTickTaskList) {
                task();
            }
            nextTickTaskList = [];
        }, 0);
    }

    nextTickTaskList.push(task);
}
