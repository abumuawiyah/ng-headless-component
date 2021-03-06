import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import {
  AccordionHeaderDirective,
  AccordionSectionDirective,
  AccordionContentDirective
} from "./accordion";
import { getDirectiveDef } from "./utils";
import { NgIf, NgForOf } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  @ViewChild("container", { read: ViewContainerRef })
  container: ViewContainerRef;
  constructor(private cfr: ComponentFactoryResolver) {
    import("./app.component").then(({ MyAccordion }) => {
      this.container.createComponent(
        this.cfr.resolveComponentFactory(MyAccordion)
      );
    });
  }
}

@asAccordion()
@Component({
  selector: "my-accordion",
  template: `
    <article>
      <section
        *accordionSection="
          items;
          let si = selectedItem;
          let hi = highlightedItem
        "
      >
        <div *ngFor="let i of items; let idx = index">
          <header accordionHeader [item]="{ data: i, index: idx }">
            {{ i }}
          </header>
          <div accordionContent *ngIf="si.index === idx">
            content {{ si.data }}
          </div>
        </div>
      </section>
    </article>
  `,
  styles: []
})
export class MyAccordion {
  items = ["azizi", "yazit", "ahmad", "zawawi"];
  constructor() {}
}

export function asAccordion() {
  return cmpType => {
    cmpType.ɵcmp.directiveDefs = [
      getDirectiveDef(AccordionSectionDirective),
      getDirectiveDef(AccordionHeaderDirective),
      getDirectiveDef(AccordionContentDirective),
      getDirectiveDef(NgIf),
      getDirectiveDef(NgForOf)
    ];
  };
}
