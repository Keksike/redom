import { setChildren } from './setchildren';
import { isFunction, ensureEl } from './util';
import { unmount } from './mount';

const propKey = key => item => item[key];

/**
 * When you have dynamic data, it's not that easy to manually
 * keep the elements and the data in sync. That's when the
 * list helper comes to rescue.
 * https://redom.js.org/documentation/#lists
 * @return {List}
 * @param {(Node | function)} parent
 * @param {function} View
 * @param {String | function} key
 * @param {*} initData
 */
export function list (parent, View, key, initData) {
  return new List(parent, View, key, initData);
}

/**
 * When you have dynamic data, it's not that easy to manually
 * keep the elements and the data in sync. That's when the
 * list helper comes to rescue.
 * https://redom.js.org/documentation/#lists
 * @class List
 */
export class List {
  /**
   * Create a List
   * @param {(Node | function)} parent
   * @param {function} View
   * @param {String | function} key
   * @param {*} initData
   */
  constructor (parent, View, key, initData) {
    this.__redom_list = true;
    this.View = View;
    this.initData = initData;
    this.views = [];
    this.el = ensureEl(parent);

    if (key != null) {
      this.lookup = {};
      this.key = isFunction(key) ? key : propKey(key);
    }
  }
  /**
   * Update the list
   * @param {Array} data - Update list with data
   */
  update (data = []) {
    const View = this.View;
    const key = this.key;
    const keySet = key != null;
    const initData = this.initData;
    const newViews = new Array(data.length);
    const oldViews = this.views;
    const newLookup = key && {};
    const oldLookup = key && this.lookup;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      let view;

      if (keySet) {
        const id = key(item);
        view = newViews[i] = oldLookup[id] || new View(initData, item, i, data);
        newLookup[id] = view;
        view.__id = id;
      } else {
        view = newViews[i] = oldViews[i] || new View(initData, item, i, data);
      }
      let el = view.el;
      if (el.__redom_list) {
        el = el.el;
      }
      el.__redom_view = view;
      view.update && view.update(item, i, data);
    }

    if (keySet) {
      for (let i = 0; i < oldViews.length; i++) {
        const id = oldViews[i].__id;

        if (!(id in newLookup)) {
          unmount(this, oldLookup[id]);
        }
      }
    }

    setChildren(this, newViews);

    if (keySet) {
      this.lookup = newLookup;
    }
    this.views = newViews;
  }
}

/**
 *
 * @return {List}
 * @param {(Node | function)} parent
 * @param {function} View
 * @param {String | function} key
 * @param {*} initData
 */
function extend (parent, View, key, initData) {
  return List.bind(List, parent, View, key, initData);
}

list.extend = List.extend = extend;
