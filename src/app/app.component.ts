import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  Directive,
  ElementRef,
  ɵComponentDef as ComponentDef,
  ɵDirectiveDef as DirectiveDef,
  Type,
  OnInit,
  AfterContentInit
} from "@angular/core";

function getComponentDef<T>(t: Type<T>): ComponentDef<T> {
  if (t["ɵcmp"]) {
    return t["ɵcmp"] as ComponentDef<T>;
  }

  throw new Error("No Angular definition found for " + t.name);
}

function getDirectiveDef<T>(t: Type<T>): DirectiveDef<T> {
  if (t["ɵdir"]) {
    return t["ɵdir"] as DirectiveDef<T>;
  }

  // A Component(Def) is also a Directive(Def)
  if (t["ɵcmp"]) {
    return t["ɵcmp"] as ComponentDef<T>;
  }

  throw new Error("No Angular definition found for " + t.name);
}

@Directive({
  selector: "[appHighlight]"
})
export class HighlightDirective {
  constructor(el: ElementRef) {
    console.log("weeiii", el);
    el.nativeElement.style.backgroundColor = "yellow";
  }
}

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

@withTheme()
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  @ViewChild("container", { read: ViewContainerRef })
  container: ViewContainerRef;
  constructor(private cfr: ComponentFactoryResolver) {
    import("./app.component").then(
      ({ AppTest1Component, HighlightDirective, ...others }) => {
        // const def1 = getComponentDef(AppTest1Component);
        // console.log("yeah", def1);

        // def1.directiveDefs = [getDirectiveDef(HighlightDirective)];
        // console.log(def1);
        this.container.createComponent(
          this.cfr.resolveComponentFactory(AppTest1Component)
        );
      }
    );
  }

  afterViewLoaded() {
    console.log("View Loaded", this);
  }
}

// export function useAccordion(implName) {
//   import("./app.component").then(({ HighlightDirective, ...others }) => {
//     const myAccordionComponentDef = getComponentDef(others[implName]);
//     myAccordionComponentDef.directiveDefs = [
//       getDirectiveDef(HighlightDirective)
//     ];
//   });
// }s

@useAccordion()
@withTheme()
@Component({
  selector: "app-test1",
  template: `
    <b appHighlight [style.color]="theme?.palette?.red">test</b>
  `,
  styles: []
})
export class AppTest1Component implements OnInit {
  ngOnInit(): void {
    // useAccordion(this.constructor.name);
  }

  constructor() {}
}

@withTheme()
@Component({
  selector: "app-test2",
  template: `
    <b [style.color]="theme?.palette?.purple">test</b>
  `,
  styles: []
})
export class AppTest2Component {}

export function useAccordion() {
  return cmpType => {
    console.log(cmpType);
    import("./app.component").then(({ HighlightDirective }) => {
      cmpType.ɵcmp.directiveDefs = [getDirectiveDef(HighlightDirective)];
    });
  };
}

export function withTheme() {
  return cmpType => {
    const originalFactory = cmpType.ɵfac;
    cmpType.ɵcmp.factory = (...args: any) => {
      const cmp: any = originalFactory(...args);
      cmp.theme = {
        palette: {
          red: "red",
          black: "black",
          yellow: "yellow",
          white: "white",
          purple: "rebeccapurple"
        },
        spacing: {
          xxs: 4,
          xs: 8,
          sm: 12,
          md: 20,
          lg: 32,
          xl: 52,
          xxl: 84
        }
      };
      return cmp;
    };
    return cmpType;
  };
}
