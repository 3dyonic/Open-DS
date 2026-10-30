// Uses only what open-ds init writes: src/styles/open-ds.css and src/components/ui/*.
import { createRoot } from "react-dom/client";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import "./index.css";

function App() {
  return (
    <main className="mx-auto grid max-w-xl gap-[var(--space-gap-group)] p-[var(--space-inset-container)]">
      <Card>
        <CardHeader>
          <CardTitle>Order 1042</CardTitle>
          <CardDescription>Due in 3 days</CardDescription>
        </CardHeader>
        <Badge tone="warning">Late</Badge>
      </Card>
      <Label htmlFor="email">Email address</Label>
      <Input id="email" placeholder="name@example.com" />
      <div className="flex gap-[var(--space-gap-default)]">
        <Button>Save order</Button>
        <Button variant="secondary">Cancel</Button>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
