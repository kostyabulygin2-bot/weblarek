import { Card, TCard } from "./Card";
import { ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";

export type TCardBasket = TCard & {
  index: number;
}

export class CardBasket extends Card<TCardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardActions) {
    super(container)

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if(actions.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set index(value: number) {
    this.container.textContent = String(value);
  }
}