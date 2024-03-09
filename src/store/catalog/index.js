import {codeGenerator} from "../../utils";
import StoreModule from "../module";

const ITEMS_PER_PAGE = 10;

class Catalog extends StoreModule {

  constructor(store, name) {
    super(store, name);
    this.generateCode = codeGenerator(0)
  }

  initState() {
    return {
      list: [],
      itemsCount: 0,
      pagesCount: 0,
      page: 1
    }
  }

  
  async load(page = 1) {
    const response = await fetch(`/api/v1/articles?limit=${ITEMS_PER_PAGE}&skip=${(page - 1) * ITEMS_PER_PAGE}&fields=items(_id, title, price),count`);
    const json = await response.json();
    this.setState({
      ...this.getState(),
      list: json.result.items,
      itemsCount: json.result.count,
      pagesCount: Math.ceil(json.result.count / ITEMS_PER_PAGE),
      page
    }, 'Загружены товары из АПИ');
  }

  /**
   * Переход на страницу
   * @param page Номер странрицы
   */
  async setPage(page) {
    const response = await fetch(`/api/v1/articles?limit=${ITEMS_PER_PAGE}&skip=${(page - 1) * ITEMS_PER_PAGE}&fields=items(_id, title, price),count`);
    const json = await response.json();
    this.setState({
      ...this.getState(),
      list: json.result.items,
      itemsCount: json.result.count,
      pagesCount: Math.ceil(json.result.count / ITEMS_PER_PAGE),
      page
    }, 'Переход на страницу ' + page);
  }


  /**
   * Получаем данные о товаре
   * @param page Номер странрицы
   */
  async getArticle(articleId) {
    const response = await fetch(`/api/v1/articles/${articleId}?fields=*,madeIn(title,code),category(title)`);
    const json = await response.json();
    console.log(json)
    /*
    this.setState({
      ...this.getState(),
      list: json.result.items,
      itemsCount: json.result.count,
      pagesCount: Math.ceil(json.result.count / ITEMS_PER_PAGE),
      page
    }, 'Переход на страницу ' + page);
    */
  }
}

export default Catalog;
