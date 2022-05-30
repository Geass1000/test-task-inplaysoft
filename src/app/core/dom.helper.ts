import { Injectable } from '@angular/core';

@Injectable()
export class DOMHelper {

  /**
   * Traverses the Element and its parents (heading toward the limit element) until it finds
   * a node that matches the provided selector string.
   *
   * @param  {HTMLElement|SVGElement} startEl
   * @param  {string} selector
   * @param  {HTMLElement|SVGElement} limitEl
   * @return {HTMLElement|SVGElement}
   */
  closestToLimit (
    startEl: HTMLElement | SVGElement,
    selector: string,
    limitEl: HTMLElement | SVGElement,
  ): HTMLElement | SVGElement {
    let selectedEl = startEl;

    while (_.isNil(startEl) === false) {
      if (selectedEl.matches(selector) === true) {
        return selectedEl;
      }

      if (selectedEl === limitEl) {
        return null;
      }

      selectedEl = selectedEl.parentElement;
    }

    return null;
  }

  /**
   * Traverses the Element and its parent (heading toward the limit element) until it finds
   * a node that matches the provided element.
   *
   * @param  {HTMLElement|SVGElement} startEl
   * @param  {HTMLElement | SVGElement} parentEl
   * @param  {HTMLElement|SVGElement} limitEl
   * @return {boolean}
   */
  isElementInElementWithLimit (
    startEl: HTMLElement | SVGElement,
    parentEl: HTMLElement | SVGElement,
    limitEl: HTMLElement | SVGElement,
  ): boolean {
    let selectedEl = startEl;

    while (_.isNil(startEl) === false) {
      if (selectedEl === parentEl) {
        return true;
      }

      if (selectedEl === limitEl) {
        return false;
      }

      selectedEl = selectedEl.parentElement;
    }

    return false;
  }
}
