import { Directive, HostListener } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[resizableLeftElement]',
})
export class ResizableLeftElementDirective {
  constructor() {}

  private _mouseMoved$ = new Subject<MouseEvent>();
  public mouseMoved$ = this._mouseMoved$.asObservable();

  private _mouseUp$ = new Subject<MouseEvent>();
  public mouseUp$ = this._mouseUp$.asObservable();

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this._mouseMoved$.next(event);
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    this._mouseUp$.next(event);
  }
}
