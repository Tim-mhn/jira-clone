import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import { map, switchMap, takeUntil } from 'rxjs';
import { ResizableLeftElementDirective } from '../resizable-left-element.directive';
import { ResizableRightElementDirective } from '../resizable-right-element.directive';
import { logMethod } from '../../../utils/log-method.decorator';
import { SubscriptionHandler } from '../../../services/subscription-handler.service';

@Component({
  selector: 'resizable-container, [resizable-container]',
  templateUrl: './resizable-container.component.html',
})
export class ResizableContainerComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  @Input() resizable: boolean;

  @ViewChild('container') container: ElementRef<HTMLElement>;

  @ContentChild(ResizableLeftElementDirective)
  private _leftElement: ResizableLeftElementDirective;
  @ContentChildren(ResizableRightElementDirective)
  private _rightElements: QueryList<ResizableRightElementDirective>;

  private _subHandler = new SubscriptionHandler();
  ngOnInit(): void {}

  ngAfterContentInit() {
    this._resizeRightElementWhenMovingMouse();
    this._stopResizingOnSideElementsMouseUps();
  }

  private _stopResizingOnSideElementsMouseUps() {
    this._leftElement.mouseUp$
      .pipe(takeUntil(this._subHandler.onDestroy$))
      .subscribe(() => this.disableResizing());
    this.rightElement
      .pipe(
        switchMap((el) => el.mouseUp$),
        takeUntil(this._subHandler.onDestroy$)
      )
      .subscribe(() => this.disableResizing());
  }

  private _resizeRightElementWhenMovingMouse() {
    this._leftElement.mouseMoved$.subscribe((event) =>
      this.resizeRightElement(event)
    );
    this.rightElement
      .pipe(switchMap((el) => el.mouseMoved$))
      .subscribe((event) => this.resizeRightElement(event));
  }

  private get rightElement() {
    return this._rightElements.changes.pipe(
      map(() => this._rightElements.first)
    );
  }

  resizeRightElement(event: MouseEvent) {
    if (!this.resizing) return;
    const { right } = this.container.nativeElement.getBoundingClientRect();

    const newWidth = right - event.clientX;
    this.width = newWidth;
    this._rightElements.first.setWidth(newWidth);
  }

  width = 200;

  resizing = false;
  enableResizing() {
    this.resizing = true;
  }

  @logMethod
  disableResizing() {
    this.resizing = false;
  }

  ngOnDestroy() {
    this._subHandler.destroy();
  }
}
