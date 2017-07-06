import { createElement } from './create-element';
import { parseArguments, isString, isNode } from './util';

const htmlCache = {};

const memoizeHTML = query => htmlCache[query] || (htmlCache[query] = createElement(query));

/**
 * Create HTML elements with HyperScript-like syntax.
 * @return {Node}
 * @param {(String|Node)} query - Query (tagname#ids.classes)
 * @param {*} [args]
 */
export function html (query, ...args) {
  let element;

  if (isString(query)) {
    element = memoizeHTML(query).cloneNode(false);
  } else if (isNode(query)) {
    element = query.cloneNode(false);
  } else {
    throw new Error('At least one argument required');
  }

  parseArguments(element, args);

  return element;
}

/**
 * @return {html}
 * @param {{(String|Node)}} query - Query (tagname#ids.classes)
 */
function extend (query) {
  const clone = memoizeHTML(query);

  return html.bind(this, clone);
}

html.extend = extend;

export const el = html;
