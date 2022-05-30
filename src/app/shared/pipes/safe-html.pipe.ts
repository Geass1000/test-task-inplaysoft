import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Sanitizes HTML.
 */
@Pipe({
  name: 'safeHTML',
})
export class SafeHTMLPipe implements PipeTransform {
  constructor (
    private domSanitizer: DomSanitizer,
  ) { }

  transform (
    htmlCode: string,
  ): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(htmlCode);
  }
}
