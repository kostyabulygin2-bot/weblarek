import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IBasket {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}

export class Basket extends Component<IBasket> {
  protected basketList: HTMLElement;
  protected totalElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:order');
    })
  }

  set items(value: HTMLElement[]) {
    this.basketList.replaceChildren(...value);
  }

  set total(value: number){
    this.totalElement.textContent = `${value} синапсов`
  }

  set buttonDisabled(value: boolean){
    this.basketButton.disabled = value;
  }
}