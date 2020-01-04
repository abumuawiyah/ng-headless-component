import {
  ɵComponentDef as ComponentDef,
  ɵDirectiveDef as DirectiveDef,
  Type
} from "@angular/core";

export function getComponentDef<T>(t: Type<T>): ComponentDef<T> {
  if (t["ɵcmp"]) {
    return t["ɵcmp"] as ComponentDef<T>;
  }

  throw new Error("No Angular definition found for " + t.name);
}

export function getDirectiveDef<T>(t: Type<T>): DirectiveDef<T> {
  if (t["ɵdir"]) {
    return t["ɵdir"] as DirectiveDef<T>;
  }

  // A Component(Def) is also a Directive(Def)
  if (t["ɵcmp"]) {
    return t["ɵcmp"] as ComponentDef<T>;
  }

  throw new Error("No Angular definition found for " + t.name);
}
