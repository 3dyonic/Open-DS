import ComponentTypes from "@theme-original/NavbarItem/ComponentTypes";
import SchemeLinks from "./SchemeLinks";
import SchemeSwitcher from "./SchemeSwitcher";

// The two navbar items the scheme switch needs (OD-207), next to Docusaurus's own.
export default {
  ...ComponentTypes,
  "custom-schemeLinks": SchemeLinks,
  "custom-schemeSwitcher": SchemeSwitcher,
};
