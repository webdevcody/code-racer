import type { LinkedListInterface, Node } from "./types";

class LinkedListNode<T> implements Node<T> {
	public value: T;
	public next: LinkedListNode<T> | undefined;
	constructor(item: T) {
		this.value = item;
		this.next = undefined;
	}
}

/** T for the item,
 *  K for key
 *
 *  Always provide a key to look for if
 *  performing search operations such as deletion
 */
class LinkedListMemory<T, K extends keyof T>
	implements LinkedListInterface<T, K>
{
	public length: number;
	private head: LinkedListNode<T> | undefined;
	private tail: LinkedListNode<T> | undefined;

	constructor() {
		this.length = 0;
		this.head = undefined;
		this.tail = undefined;
	}

	append(item: T): void {
		const node = new LinkedListNode(item);
		this.length = this.length + 1;

		if (!this.tail) {
			this.head = node;
			this.tail = node;
			return;
		}

		const MEMORY_HAS_SINGLE_ITEM = !this.head?.next;
		if (this.head && MEMORY_HAS_SINGLE_ITEM) {
			this.head.next = this.tail;
		}
		this.tail.next = node;
		this.tail = node;
	}

	prepend(item: T): void {
		const node = new LinkedListNode(item);
		this.length = this.length - 1;

		if (!this.head) {
			this.head = node;
			this.tail = node;
			return;
		}

		node.next = this.head;
		this.head = node;
	}

	remove(item: T, keyToMatchFor: K): Node<T> | undefined {
		return this.removeNode(item, keyToMatchFor);
	}

	removeItemIfStringEqualToKeyValue(item: string, key: K): Node<T> | undefined {
		return this.removeNode(item, key);
	}

	get(item: T, keyToMatchFor: K): Node<T> | undefined {
		return this.getNode(item, keyToMatchFor);
	}

	getItemIfStringEqualToKeyValue(item: string, key: K): Node<T> | undefined {
		return this.getNode(item, key);
	}

	getItemAt(idx: number): Node<T> | undefined {
		if (idx === 0) {
			return this.head;
		}
		let currentNode = this.head;
		for (let i = 0; currentNode && i < idx; ++i) {
			currentNode = currentNode.next;
		}
		return currentNode;
	}

	private removeNode(item: T | string, key: K): Node<T> | undefined {
		if (this.length === 1) {
			const tmp = this.head;
			this.length = this.length - 1;
			this.tail = undefined;
			this.head = undefined;
			return tmp;
		}

		let currentNode = this.head;
		let previousNode = undefined as LinkedListNode<T> | undefined;

		for (let idx = 0; currentNode && idx < this.length; ++idx) {
			if (typeof item === "string") {
				if (currentNode.value[key] === item) {
					break;
				}
			} else {
				if (item[key] === currentNode.value[key]) {
					break;
				}
			}
			previousNode = currentNode;
			currentNode = currentNode.next;
		}

		if (!currentNode) {
			return undefined;
		}

		this.length = this.length - 1;

		if (currentNode === this.head) {
			this.head = currentNode.next;
		}

		if (previousNode) {
			if (previousNode.next === this.tail) {
				/** If the item to be removed is the tail of this list. */
				previousNode.next = undefined;
				this.tail = previousNode;
			} else {
				previousNode.next = currentNode.next;
			}
			return currentNode;
		}
	}

	private getNode(item: T | string, keyToMatchFor: K): Node<T> | undefined {
		let currentNode = this.head;
		for (let idx = 0; currentNode && idx < this.length; ++idx) {
			if (typeof item === "string") {
				if (item === currentNode.value[keyToMatchFor]) {
					break;
				}
			} else {
				if (item[keyToMatchFor] === currentNode.value[keyToMatchFor]) {
					break;
				}
			}
			currentNode = currentNode.next;
		}
		return currentNode;
	}
}

export default LinkedListMemory;
