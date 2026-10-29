import { IProduct } from "../../types";

export class Cart {
  private items: IProduct[];

  constructor() {
    this.items = [];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product)
  }

  removeItem(product: IProduct): void {
    const index = this.items.findIndex(item => item.id === product.id);

    if (index !== -1){
      this.items.splice(index, 1);
    }
  }

  clearCart(): void {
    this.items = [];
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