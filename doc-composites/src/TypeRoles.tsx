/**
 * TypeRoles: each type role as a line set in its own tokens, with the role's name and values. Built
 * from the scheme's Card and Item, used through their props only; Sample sets each line. The data
 * follows doc-composites/schemas/type-roles.schema.json; the page holds one line: ::type-roles{id="type"}
 */
import * as React from "react";
import { Card, CardContent } from "@open-ds/ui/components/card";
import {
  Item,
  ItemContent,
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
  return (
    <div data-composite="type-roles">
      <Card>
        <CardContent>
          <div className="flex flex-col gap-[var(--space-gap-tight)]">
            {data.roles.map((r) => (
              <Item key={r.role}>
                <ItemContent>
                  <ItemTitle>{r.role}</ItemTitle>
                  <ItemDescription>
                    {[r.size, r.lineHeight, r.weight].filter(Boolean).join(" · ")}
                  </ItemDescription>
                  <Sample kind="type" role={r.role}>
                    {r.text}
                  </Sample>
                </ItemContent>
              </Item>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
