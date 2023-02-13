import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml',
})
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {}
  transform(html: string): string {
    return this._sanitizer.sanitize(SecurityContext.HTML, html);
  }
}
