import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export interface IForm {
  valid: boolean;
  errors: string;
}

export abstract class Form<T extends IForm> extends Component<T> {
  protected submitElement: HTMLButtonElement;
  protected formErrors: HTMLElement;

  constructor(protected events: IEvents, container: HTMLFormElement) {
    super(container);

    this.submitElement = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);

    this.submitElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit(`${container.name}:submit`)
    })
  }

  set valid(value: boolean) {
    this.submitElement.disabled = !value;
  }

  set errors(value: string){
    this.formErrors.textContent = value;
  }
}