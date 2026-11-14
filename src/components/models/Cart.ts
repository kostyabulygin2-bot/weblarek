import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  private items: IProduct[];

  constructor(protected events: IEvents) {
    this.items = [];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('cart:changed')
  }

  removeItem(product: IProduct): void {
    const index = this.items.findIndex(item => item.id === product.id);

    if (index !== -1){
      this.items.splice(index, 1);
    };

    this.events.emit('cart:changed');
  }

  clearCart(): void {
    this.items = [];
    this.events.emit('cart:changed')
  }

  getCostItems(): number {
    return this.items.reduce ((total, item) => {
      return total + (item.price ?? 0)
    }, 0);
  }

  getCountItems(): number {
    return this.items.length;
  }

   hasItem(id:string): boolean {
    return this.items.some(item => item.id === id)
  }
}