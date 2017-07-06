import { createElement } from './create-element';
import { parseArguments, isString, isNode } from './util';

const SVG = 'http://www.w3.org/2000/svg';

const svgCache = {};

const memoizeSVG = query => svgCache[query] || (svgCache[query] = createElement(query, SVG));

/**
 * el and html only create HTML elements. If you
 * want to create a SVG element, you must use `svg`.
 * @param {String | Element} query
 * @param {*} args
 */
export function svg (query, ...args) {
  let element;

  if (isString(query)) {
    element = memoizeSVG(query).cloneNode(false);
  } else if (isNode(query)) {
    element = query.cloneNode(false);
  } else {
    throw new Error('At least one argument required');
  }

  parseArguments(element, args);

  return element;
}

svg.extend = extend;

/**
 * @return {svg}
 * @param {String | Element} query
 */
function extend (query) {
  const clone = memoizeSVG(query);

  return svg.bind(this, clone);
}
