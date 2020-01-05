import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import {
  HighlightDirective,
  AccordionHeaderDirective,
  AccordionSectionDirective
} from "./accordion";
import { getDirectiveDef } from "./utils";

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

@useAccordion()
@Component({
  selector: "my-accordion",
  template: `
    <article>
      <section accordionSection>
        <header accordionHeader [item]="{ data: {} }">
          Header
        </header>
        <div>
          Content
        </div>
      </section>
    </article>
  `,
  styles: []
})
export class MyAccordion {
  constructor() {}
}

export function useAccordion() {
  return cmpType => {
    cmpType.ɵcmp.directiveDefs = [
      getDirectiveDef(HighlightDirective),
      getDirectiveDef(AccordionSectionDirective),
      getDirectiveDef(AccordionHeaderDirective)
    ];
  };
}
