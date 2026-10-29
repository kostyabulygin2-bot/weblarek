import { IApi } from '../../types';
import { IProductList } from '../../types';
import { IResponseOrder } from '../../types';
import { IRequestData } from '../../types';

export class LarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProductList(): Promise<IProductList> {
    return this.api.get('/product/')
  }

  sendOrder(order: IRequestData): Promise<IResponseOrder> {
    return this.api.post<IResponseOrder>('/order/', order);
  }
}