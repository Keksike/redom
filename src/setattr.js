import { setStyle } from './setstyle';
import { isFunction, getEl } from './util';

/**
 * A helper for updating attributes and properties.
 * Will auto-detect attributes and properties.
 * @param {Element | Object} view
 * @param {String | Object} arg1
 * @param {*} [arg2]
 */
export function setAttr (view, arg1, arg2) {
  const el = getEl(view);
  let isSVG = el instanceof window.SVGElement;

  if (arg2 !== undefined) {
    if (arg1 === 'style') {
      setStyle(el, arg2);
    } else if (isSVG && isFunction(arg2)) {
      el[arg1] = arg2;
    } else if (!isSVG && (arg1 in el || isFunction(arg2))) {
      el[arg1] = arg2;
    } else {
      el.setAttribute(arg1, arg2);
    }
  } else {
    for (const key in arg1) {
      setAttr(el, key, arg1[key]);
    }
  }
}
