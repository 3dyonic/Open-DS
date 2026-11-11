/**
 * TypeRoles: each type role as a line set in its own tokens, with the role's name and values. Built
 * from the scheme's Card and Item, used through their props only; Sample sets each line. The data
 * follows doc-composites/schemas/type-roles.schema.json; the page holds one line: ::type-roles{id="type"}
 */
import * as React from "react";
import { Card, CardContent } from "@open-ds/ui/components/card";
import {
  Item,
  ItemDescription,
  ItemTitle,
} from "@open-ds/ui/components/item";
import Sample from "./Sample";

export type TypeRole = {
  role: string;
  text: string;
  size?: string;
  lineHeight?: string;
  weight?: string;
};
export type TypeRolesData = { roles: TypeRole[] };

export default function TypeRoles({ data }: { data: TypeRolesData }) {
  // One row per role, as RC1 drew it: the role and its values on the left, the line set in the role
  // on the right, cut to one line, a divider between rows.
  return (
    <div data-composite="type-roles">
      <Card>
        <CardContent>
          <div className="flex flex-col">
            {data.roles.map((r) => (
              <div key={r.role} className="border-b border-[var(--color-border-default)] last:border-b-0">
                <Item>
                  <div className="flex w-40 flex-none flex-col">
                    <ItemTitle>{r.role}</ItemTitle>
                    <ItemDescription>
                      <span className="[font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)] whitespace-pre">
                        {[r.size, r.lineHeight, r.weight].filter(Boolean).join(" · ")}
                      </span>
                    </ItemDescription>
                  </div>
                  <div className="min-w-0 flex-1 truncate">
                    <Sample kind="type" role={r.role}>
                      {r.text}
                    </Sample>
                  </div>
                </Item>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
