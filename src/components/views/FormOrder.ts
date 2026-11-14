import { Form, IForm } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IBuyer, TFormMod, TPayment } from "../../types";

export type TFormOrder = IForm & Pick<IBuyer, 'payment' | 'address'>

export class FormOrder extends Form<TFormOrder> {
  protected buttonCard: HTMLButtonElement;
  protected buttonCash: HTMLButtonElement;
  protected inputAddress: HTMLInputElement;

  constructor(protected events: IEvents, container: HTMLFormElement) {
    super(events, container);

    this.buttonCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.buttonCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.inputAddress = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.buttonCard.addEventListener('click', () => {
      this.events.emit<TFormMod>('form:change', {payment: 'card'})
    })

    this.buttonCash.addEventListener('click', () => {
      this.events.emit<TFormMod>('form:change', {payment: 'cash'})
    })

    this.inputAddress.addEventListener('input', () => {
      this.events.emit<TFormMod>('form:change', {address: this.inputAddress.value})
    })
  }

  set payment(value: TPayment | '') {
    this.buttonCard.classList.toggle('button_alt-active', value === 'card');
    this.buttonCash.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.inputAddress.value = value;
  }
}