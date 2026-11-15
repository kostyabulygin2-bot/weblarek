import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { TCardCatalog, CategoryKey } from "./CardCatalog";
import { IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";

export type TCardPreviw = TCardCatalog & Pick<IProduct, 'description'> & {
  buttonText: string;
  buttonDisabled: boolean;
}

export class CardPreview extends Card<TCardPreviw> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buttonElement.addEventListener('click', () => {
      this.events.emit('preview:button-click');
    })
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for(const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      )
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, '');
  }

  set imageAlt(value: string) {
    this.imageElement.alt = value;
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value:boolean) {
    this.buttonElement.disabled = value;
  }
}