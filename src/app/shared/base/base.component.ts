import { OnDestroy, Component, ChangeDetectorRef } from '@angular/core';
import { BaseManager } from './base.manager';

@Component({
  selector: 'ag-base',
  template: '<div></div>',
})
export class BaseComponent extends BaseManager implements OnDestroy {
  constructor (
    protected changeDetection: ChangeDetectorRef,
  ) {
    super();

    this.changeDetection.detach();
  }

  /**
   * Destroys all RxJs subscriptions.
   *
   * @return {void}
   */
  ngOnDestroy (
  ): void {
    this.$destroy();
  }

  /**
   * Invokes a render procedure in next Angular tick if params are changed or it's a first render.
   *
   * @param  {string} label
   * @param  {any[]} params
   * @return {void}
   */
  render (
    label: string,
    params: any[],
  ): void {
    if (this.shouldUpdate(label, params) === false) {
      return;
    }

    this.changeDetection.detectChanges();
  }

  /**
   * Renders view without params check.
   *
   * @return {void}
   */
  forceRender (
  ): void {
    this.changeDetection.detectChanges();
  }
}
