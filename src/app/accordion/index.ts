import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: "[accordionSection]"
})
export class AccordionSectionDirective {
  constructor(el: ElementRef) {
    // inject or add specs for accordion section into el.nativeElement
  }
}

@Directive({
  selector: "[accordionHeader]"
})
export class AccordionHeaderDirective {
  constructor(el: ElementRef) {
    // inject or add specs for accordion header into el.nativeElement
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
