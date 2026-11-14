import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
  private items: IProduct[];
  private selectedProduct: IProduct | null;

  constructor(protected events: IEvents) {
    this.items = [];
    this.selectedProduct = null;
  }

  setItems(items: IProduct[]): void {
    this.items = items;

    this.events.emit('catalog:changed')
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | null {
    return this.items.find(product => product.id === id) || null;
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('preview:changed')
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

}