import { IProduct } from "../../types";

export class Catalog {
  private items: IProduct[];
  private selectedProduct: IProduct | null;

  constructor() {
    this.items = [];
    this.selectedProduct = null;
  }

  setItems(products: IProduct[]): void {
    this.items = products;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | null {
    return this.items.find(product => product.id === id) || null;
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

  hasItem(id:string): boolean {
    return this.items.some(item => item.id === id)
  }
}