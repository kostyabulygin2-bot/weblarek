import { IBuyer } from "../../types";
import { ValidationErrors } from "../../types";

export class Buyer {
  private data: IBuyer;

  constructor() {
    this.data = {
      payment: null,
      address: '',
      phone: '',
      email: ''
    };
  }

  setData(partialData: Partial<IBuyer>): void {
    this.data = {
      ...this.data,
      ...partialData
    }
  }

  getData(): IBuyer {
    return {
      ...this.data
    }
  }

  clearData(): void {
    this.data = {
      payment: null,
      address: '',
      phone: '',
      email: ''
    };
  }

  validate(): ValidationErrors {
    const errors : ValidationErrors = {};

    if (!this.data.address.trim()) {
      errors.address = 'Укажите адресс';
    }

    if (!this.data.phone.trim()) {
      errors.phone = 'Введите телефон';
    }

    if (!this.data.email.trim()) {
      errors.email = 'Укажите email'
    }

    if (this.data.payment === null) {
      errors.payment = 'Выберите вид оплаты: карта или наличные'
    }
    return errors
  }
}