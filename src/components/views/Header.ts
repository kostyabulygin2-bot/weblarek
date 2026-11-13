import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected busketButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.busketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    this.busketButton.addEventListener('click', () => {
      this.events.emit('busket:open');
    })
  }

  set counter(value: number) {
      this.counterElement.textContent = String(value)
    }
}