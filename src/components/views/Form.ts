import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export interface IForm {
  validButton: boolean;
  errors: string;
}

export abstract class Form<T extends IForm> extends Component<T> {
  protected submitElement: HTMLButtonElement;
  protected formErrors: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.submitElement = ensureElement<HTMLButtonElement>('.button', this.container);
    this.formErrors = ensureElement<HTMLElement>('form__errors', this.container);

    this.submitElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('form:submit')
    })
  }

  set validButton(value: boolean) {
    this.submitElement.disabled = !value;
  }

  set errors(value: string){
    this.formErrors.textContent = value;
  }
}