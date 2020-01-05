import {
  Directive,
  ElementRef,
  forwardRef,
  Inject,
  OnDestroy,
  AfterViewInit,
  OnInit,
  Input
} from "@angular/core";
import { BehaviorSubject, Subject, fromEvent } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive({
  selector: "[accordionSection]"
})
export class AccordionSectionDirective {
  state = new BehaviorSubject({ selectedItem: {}, highlightedItem: {} });

  itemClick(item) {
    this.state.next({
      selectedItem: item,
      highlightedItem: this.state.getValue().highlightedItem
    });

    console.log("state", this.state);
  }

  itemHover(item) {
    this.state.next({
      highlightedItem: item,
      selectedItem: this.state.getValue().selectedItem
    });
  }

  constructor(el: ElementRef) {
    // inject or add specs for accordion section into el.nativeElement
  }
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

@Directive({
  selector: "[accordionContent]"
})
export class AccordionContentDirective {
  constructor(el: ElementRef) {
    // inject or add specs for accordion content into el.nativeElement
  }
}

@Directive({
  selector: "[appHighlight]"
})
export class HighlightDirective {
  constructor(el: ElementRef) {
    console.log("azizi", el);
    el.nativeElement.style.backgroundColor = "yellow";
  }
}
