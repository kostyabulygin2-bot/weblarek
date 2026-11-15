import "./scss/styles.scss";
import { Catalog } from "./components/models/Catalog";
import { Cart } from "./components/models/Cart";
import { Buyer } from "./components/models/Buyer";
import { LarekApi } from "./components/models/LarekApi";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { Modal } from "./components/views/Modal";
import { CardCatalog } from "./components/views/CardCatalog";
import { CardPreview } from "./components/views/CardPreview";
import { CardBasket } from "./components/views/CardBasket";
import { Basket, IBasket } from "./components/views/Basket";
import { FormOrder, TFormOrder } from "./components/views/FormOrder";
import { FormContacts, TFormContacts } from "./components/views/FormContacts";
import { Success } from "./components/views/Success";
import { IProduct, IRequestData, TFormMod } from "./types";

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Данные с сервера
const api = new Api(API_URL);

// --- Участники ---

// Брокер событий.
const events = new EventEmitter();

// Модели данных (Model)
const larekApi = new LarekApi(api);
const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// Компоненты представления(View)
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));
const cardPreview = new CardPreview(events, cloneTemplate(cardPreviewTemplate));
const basketView = new Basket(events, cloneTemplate(basketTemplate));
const orderForm = new FormOrder(events, cloneTemplate<HTMLFormElement>(orderTemplate));
const contactsForm = new FormContacts(events, cloneTemplate<HTMLFormElement>(contactsTemplate));
const success = new Success(events, cloneTemplate(successTemplate));

// Создание карточек товаров в корзине
function getBasketCards(): HTMLElement[] {
    return cart.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket-item:delete-click', item),
        });
        return card.render({ title: item.title, price: item.price, index: index + 1 });
    });
}

// Подготовка данных корзины для отрисовки
function getBasketData(): IBasket {
    return {
        items: getBasketCards(),
        total: cart.getCostItems(),
        buttonDisabled: cart.getCountItems() === 0,
    };
}

// Получение данных способа оплаты и адресса покупателя, а также проверка правильности заполнения формы
function getOrderFormData(): TFormOrder {
    const { payment, address } = buyer.getData();
    const errors = buyer.validate();
    return {
        payment,
        address,
        valid: !errors.payment && !errors.address,
        errors: [errors.payment, errors.address].filter(Boolean).join('; '),
    };
}

// Получение данных емейла и номера телефона покупателя, а также проверка правильности заполнения формы
function getContactsFormData(): TFormContacts {
    const { email, phone } = buyer.getData();
    const errors = buyer.validate();
    return {
        email,
        phone,
        valid: !errors.email && !errors.phone,
        errors: [errors.email, errors.phone].filter(Boolean).join('; '),
    };
}

// --- События моделей данных ---

// Изменение каталога товаров
events.on('catalog:changed', () => {
    const cards = catalog.getItems().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render({
            title: item.title,
            price: item.price,
            image: item.image,
            imageAlt: item.title,
            category: item.category,
        });
    });

    gallery.render({ catalog: cards });
});

// Изменение выбранного для просмотра товара
events.on('preview:changed', () => {
    const product = catalog.getSelectedProduct();
    if (!product) return;

    let buttonText = 'Купить';
    if (product.price === null) {
        buttonText = 'Недоступно';
    } else if (cart.hasItem(product.id)) {
        buttonText = 'Удалить из корзины';
    }

    modal.render({
        content: cardPreview.render({
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            description: product.description,
            buttonText,
            buttonDisabled: product.price === null,
        }),
    });
    modal.open();
});

// Изменение содержимого корзины
events.on('cart:changed', () => {
    header.render({ counter: cart.getCountItems() });
    basketView.render(getBasketData());
});

// Изменение данных покупателя
events.on('buyer:changed', () => {
    orderForm.render(getOrderFormData());
    contactsForm.render(getContactsFormData());
});

// --- События данных представления ---

// Выбор карточки для просмотра
events.on('card:select', (product: IProduct) => {
    catalog.setSelectedProduct(product);
});

// Нажатие кнопки покупки товара
events.on('preview:button-click', () => {
    const product = catalog.getSelectedProduct();
    if (!product) return;

    if (cart.hasItem(product.id)) {
        cart.removeItem(product);
    } else {
        cart.addItem(product);
    }
    modal.close();
});

// Нажатие кнопки удаления товара из корзины
events.on('basket-item:delete-click', (product: IProduct) => {
    cart.removeItem(product);
});

// Нажатие кнопки открытия корзины
events.on('basket:open', () => {
    modal.render({ content: basketView.render() });
    modal.open();
});

// Нажатие кнопки оформления заказа
events.on('basket:order', () => {
    modal.render({ content: orderForm.render() });
    modal.open();
});

// Нажатие кнопки перехода ко второй форме оформления заказа
events.on('form:change', (data: TFormMod) => {
    buyer.setData(data);
});

// Изменение данных в первой форме оформления заказа
events.on('order:submit', () => {
    modal.render({ content: contactsForm.render() });
    modal.open();
});

// Изменение данных во второй форме оформления заказа
events.on('contacts:submit', () => {
    const order: IRequestData = {
        ...buyer.getData(),
        total: cart.getCostItems(),
        items: cart.getItems().map((item) => item.id),
    };
     larekApi
        .sendOrder(order)
        .then((result) => {
            cart.clearCart();
            buyer.clearData();
            modal.render({ content: success.render({ total: result.total }) });
            modal.open();
        })
        .catch((error) => {
            console.error('Ошибка оформления заказа', error);
        });
});

// Нажатие кнопки оплаты/завершения оформления заказа
events.on('success:close', () => {
    modal.close();
});

// Загрузка товаров с каталога
larekApi.getProductList()
  .then((products) => {
    products.items.forEach((product) => {
      product.image = CDN_URL + product.image;
    });

    catalog.setItems(products.items);
  })
  .catch((error: Error) => {
    console.error("Ошибка при загрузке товаров с сервера:", error);
  });
