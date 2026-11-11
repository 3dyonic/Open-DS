import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import type { Props } from "./TokenMapView";

// The Token map (OD-274) draws in the browser only: React Flow measures the page it draws on.
export default function TokenMap(props: Props) {
  return (
    <BrowserOnly fallback={<p>Loading the token map.</p>}>
      {() => {
        const View = require("./TokenMapView").default as React.ComponentType<Props>;
        return <View {...props} />;
      }}
    </BrowserOnly>
  );
}
