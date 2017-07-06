import { ensureEl } from './util';
import { setChildren } from './setchildren';

export function router (parent, Views, initData) {
  return new Router(parent, Views, initData);
}

/**
 * Router is a component router, which will
 * create/update/remove components based on
 * the current route.
 * https://redom.js.org/documentation/#router
 * @class Router
 */
export class Router {
  /**
   * @param {Element | Object} parent
   * @param {Object} Views
   * @param {*} [initData]
   */
  constructor (parent, Views, initData) {
    this.el = ensureEl(parent);
    this.Views = Views;
    this.initData = initData;
  }
  /**
   *
   * @param {String} route
   * @param {*} [data]
   */
  update (route, data) {
    if (route !== this.route) {
      const Views = this.Views;
      const View = Views[route];

      this.view = View && new View(this.initData, data);
      this.route = route;

      setChildren(this.el, [ this.view ]);
    }
    this.view && this.view.update && this.view.update(data, route);
  }
}
