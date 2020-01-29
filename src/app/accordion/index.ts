import {
  Directive,
  ElementRef,
  forwardRef,
  Inject,
  OnDestroy,
  AfterViewInit,
  OnInit,
  Input,
  HostBinding,
  ViewContainerRef,
  TemplateRef
} from "@angular/core";
import { BehaviorSubject, Subject, fromEvent } from "rxjs";
import { takeUntil } from "rxjs/operators";

/**
 * This interface represents context of the directive
 */
interface AccordionSectionContext {
  selectedItem: object;
  highlightedItem: object;
}

@Directive({
  selector: "[accordionSection]"
})
export class AccordionSectionDirective {
  state = new BehaviorSubject({ selectedItem: {}, highlightedItem: {} });

  @Input()
  set accordionSection(value: object) {
    this.viewRef.clear();

    this.viewRef.createEmbeddedView(this.templateRef, {
      selectedItem: this.state.getValue().selectedItem,
      highlightedItem: this.state.getValue().highlightedItem
    });
  }

  itemClick(item) {
    this.state.next({
      selectedItem: item,
      highlightedItem: this.state.getValue().highlightedItem
    });
  }

  itemHover(item) {
    this.state.next({
      highlightedItem: item,
      selectedItem: this.state.getValue().selectedItem
    });
  }

  constructor(
    private readonly viewRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<AccordionSectionContext>
  ) {}
}

@Directive({
  selector: "[accordionHeader]"
})
export class AccordionHeaderDirective
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() item: Object = {};
  private destroy = new Subject<void>();

  constructor(
    el: ElementRef,
    @Inject(forwardRef(() => AccordionSectionDirective))
    private accordionSection: AccordionSectionDirective
  ) {
    fromEvent(el.nativeElement, "click")
      .pipe(takeUntil(this.destroy))
      .subscribe(_ => this.accordionSection.itemClick(this.item));

    fromEvent(el.nativeElement, "mouseover")
      .pipe(takeUntil(this.destroy))
      .subscribe(_ => this.accordionSection.itemHover(this.item));
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}

interface Item {
  selectedItem: any;
  highlightedItem: any;
}

@Directive({
  selector: "[accordionContent]"
})
export class AccordionContentDirective {
  @HostBinding("style.display")
  display = "none";
  @Input() index;
  constructor(
    el: ElementRef,
    @Inject(forwardRef(() => AccordionSectionDirective))
    private accordionSection: AccordionSectionDirective
  ) {
    this.accordionSection.state.subscribe((data: Item) => {
      const selectedItem = data.selectedItem;
      el.nativeElement.style.display =
        this.index === selectedItem.index && "block";
    });
  }
}

/**
 * This interface represents context of the directive
 */
interface RangeContext {
  $implicit: number; // current item exposed as implicit value, enables declaring in template variable via let keyword
  index: number; // current index of the item
  first: boolean; // indicates if the item is first in the collection
  last: boolean; // indicates if the item is last in the collection
}

@Directive({
  selector: "[appRange]"
})
export class RangeDirective {
  @Input()
  set appRange(value: [number, number] | number) {
    this.viewRef.clear();

    const [from, to] = Array.isArray(value) ? value : [0, value];
    const range = this.generateRange(from, to);

    range.forEach((itemNumber, index) =>
      this.viewRef.createEmbeddedView(this.templateRef, {
        $implicit: itemNumber,
        index,
        first: index === 0,
        last: index + 1 === range.length
      })
    );

    console.log(this.viewRef);
  }

  constructor(
    private readonly viewRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<RangeContext>
  ) {}

  /**
   * Generates and array of N items (N is difference between to and from).
   * Item values are starting at `from` value and ending with `to` value.
   *
   * @param from - default is 0
   * @param to   - items will be generated up to this value
   *             - example: 7 will result in output [..., 4, 5, 6]
   */
  private generateRange(from: number = 0, to: number): number[] {
    return Array.from({ length: to - from }, (_, index) => index + from);
  }
}
