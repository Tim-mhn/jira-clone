import { Directive, ElementRef, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { logMethod } from '../../utils/log-method.decorator';

@Directive({
  selector: '[resizableRightElement]',
})
export class ResizableRightElementDirective {
  constructor(private elementRef: ElementRef<HTMLElement>) {}
  private _mouseMoved$ = new Subject<MouseEvent>();
  public mouseMoved$ = this._mouseMoved$.asObservable();

  private _mouseUp$ = new Subject<MouseEvent>();
  public mouseUp$ = this._mouseUp$.asObservable();

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this._mouseMoved$.next(event);
  }

  @logMethod
  setWidth(width: number) {
    this.elementRef.nativeElement.style.width = `${width}px`;
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    this._mouseUp$.next(event);
  }
}
