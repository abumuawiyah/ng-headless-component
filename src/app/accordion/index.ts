import {
  Directive,
  ElementRef,
  forwardRef,
  Inject,
  OnDestroy,
  AfterViewInit,
  OnInit,
  Input,
  HostBinding
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
