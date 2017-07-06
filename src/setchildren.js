import { mount, unmount } from './mount';
import { getEl } from './util';

/**
 * RE:DOM uses setChildren(parent, children) under
 * the hood for lists. When you call setChildren,
 * RE:DOM will add/reorder/remove elements/components
 * automatically by reference.
 * @param {Element | Object} parent
 * @param {Array | Element | Object} children
 */
export function setChildren (parent, children) {
  if (children.length === undefined) {
    return setChildren(parent, [children]);
  }

  const parentEl = getEl(parent);
  let traverse = parentEl.firstChild;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (!child) {
      continue;
    }

    let childEl = getEl(child);

    if (childEl === traverse) {
      traverse = traverse.nextSibling;
      continue;
    }

    mount(parent, child, traverse);
  }

  while (traverse) {
    const next = traverse.nextSibling;

    unmount(parent, traverse);

    traverse = next;
  }
}
