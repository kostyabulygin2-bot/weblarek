import { Form, IForm } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IBuyer, TFormMod } from "../../types";

export type TFormContacts = IForm & Pick<IBuyer, 'email' | 'phone'>

export class FormContacts extends Form<TFormContacts> {
  protected inputEmail: HTMLInputElement;
  protected inputPhone: HTMLInputElement;

  constructor(protected events: IEvents, container: HTMLFormElement) {
    super(events, container);

    this.inputEmail = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.inputPhone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.inputEmail.addEventListener('input', () => {
      this.events.emit<TFormMod>('form:change', {email: this.inputEmail.value})
    })
    this.inputEmail.addEventListener('input', () => {
      this.events.emit<TFormMod>('form:change', {phone: this.inputPhone.value})
    })
  }

  set email(value: string) {
    this.inputEmail.value = value;
  }

  set phone(value: string) {
    this.inputPhone.value = value;
  }
}