import ComponentTypes from "@theme-original/NavbarItem/ComponentTypes";
import SchemeSwitcher from "./SchemeSwitcher";

// The navbar item the scheme switch needs (OD-207), next to Docusaurus's own.
export default {
  ...ComponentTypes,
  "custom-schemeSwitcher": SchemeSwitcher,
};
