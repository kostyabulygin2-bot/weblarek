import "./scss/styles.scss";
import { Catalog } from "./components/models/Catalog";
import { Cart } from "./components/models/Cart";
import { Buyer } from "./components/models/Buyer";
import { LarekApi } from "./components/models/LarekApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

// ПРОВЕРКА РАБОТЫ КЛАССОВ

// Экземпляр каталога товаров
const catalog = new Catalog();
console.log("ПРОВЕРКА КЛАССА Catalog");

catalog.setItems(apiProducts.items);
console.log("Массив товаров из каталога: ", catalog.getItems());

const firstProduct = catalog.getItems()[0];
console.log("Товар в каталоге по id", catalog.getItemById(firstProduct.id));
console.log("Товар в каталоге по несуществующему id", catalog.getItemById("no-such-id"));

console.log("Товар для просмотра до выбора", catalog.getSelectedProduct());
catalog.setSelectedProduct(firstProduct);
console.log("Товар для просмотра после выбора", catalog.getSelectedProduct());

// Экземпляр корзины товаров
const cart = new Cart();
const [product1, product2, product3] = catalog.getItems();
console.log("ПРОВЕРКА КЛАССА Cart");

cart.addItem(product1);
cart.addItem(product2);
cart.addItem(product3);
console.log("Массив товаров из корзины после добавления: ", cart.getItems());
console.log("Стоимость всех товаров в корзине: ", cart.getCostItems());
console.log("Количество товаров в корзине: ", cart.getCountItems());
console.log("Есть ли товаро под номером 1 ?", cart.hasItem(product1.id));

cart.removeItem(product1);
console.log("Массив товаров из корзины после удаления товара 1: ", cart.getItems());
console.log("Есть ли товаро под номером 1 после удаления ?", cart.hasItem(product1.id));
console.log("Стоимость товаров в корзине после удаления: ", cart.getCostItems());

cart.clearCart();
console.log("Массив товаров полсе очистки корзины: ", cart.getItems());
console.log("Количество товаров в корзине после очистки: ", cart.getCountItems());

// Экземпляр покупателя
const buyer = new Buyer();
console.log("ПРОВЕРКА КЛАССА Buyer");

console.log("Ошибка пустой формы", buyer.validate());
buyer.setData({ payment: "card" });
buyer.setData({ address: "г. Дураков, ул. Пушкина, д. Колотушкина" });
console.log("Данные после ввода оплаты и адреса", buyer.getData());
console.log("Ошибки после первого шага", buyer.validate());
buyer.setData({ email: "test@test.ru", phone: "+8 800 555-35-35" });
console.log("Все данные", buyer.getData());
console.log("Ошибки заполненной формы", buyer.validate());
buyer.clearData();
console.log("Данные после очистки", buyer.getData());


// Запрос на сервер
const api = new Api(API_URL);
const larekApi = new LarekApi(api);
console.log("Загрузка товаров с сервера");
larekApi.getProductList()
  .then((productsResponse) => {
    catalog.setItems(productsResponse.items);

    // ПРОВЕРКА ДАННЫХ КАТАЛОГА
    console.log('ПРОВЕРКА ДАННЫХ КАТАЛОГА');

    // 1. Выводим сохранённый каталог
    console.log("Массив товаров из каталога после выполнения запроса с сервера: ", catalog.getItems());

    // 2. Выводим общее количество товаров
    const catalogItems = catalog.getItems();
    console.log("Количество товаров в каталоге после сохранения:", catalogItems.length);

    // 3. Выводим первый товар для проверки структуры
    if (catalogItems.length > 0) {
      const firstItem = catalog.getItems()[0];
      console.log("Первый товар в каталоге по id", catalog.getItemById(firstItem.id));
    }
  })
  .catch((error: Error) => {
    console.error("Ошибка при загрузке товаров с сервера:", error);
  });
