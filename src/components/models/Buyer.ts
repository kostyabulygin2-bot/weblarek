import { IBuyer } from "../../types";
import { ValidationErrors } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private data: IBuyer;

  constructor(protected events: IEvents) {
    this.data = {
      payment: null,
      address: "",
      phone: "",
      email: "",
    };
  }

  setData(partialData: Partial<IBuyer>): void {
    this.data = {
      ...this.data,
      ...partialData,
    };

    this.events.emit("buyer:changed");
  }

  getData(): IBuyer {
    return {
      ...this.data,
    };
  }

  clearData(): void {
    this.data = {
      payment: null,
      address: "",
      phone: "",
      email: "",
    };

    this.events.emit("buyer:changed");
  }

  validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this.data.address.trim()) {
      errors.address = "Укажите адрес";
    }

    if (!this.data.phone.trim()) {
      errors.phone = "Введите телефон";
    }

    if (!this.data.email.trim()) {
      errors.email = "Укажите email";
    }

    if (this.data.payment === null) {
      errors.payment = "Выберите вид оплаты: онлайн или при получении";
    }

    return errors;
  }
}
