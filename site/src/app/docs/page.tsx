export default function DocsPage() {
  return (
    <div className="grid max-w-3xl gap-6">
      <h1 className="text-3xl font-semibold">Docs</h1>
      <p>
        Open DS stores decisions. It does not calculate colors or tokens. Token files in a
        boilerplate use the DTCG format.
      </p>
      <h2 className="text-xl font-semibold">Validator</h2>
      <pre className="overflow-auto rounded-control border border-line p-3 text-sm">{`uv run open-ds-validator check recipes/3dyonic.json
uv run open-ds-validator boilerplate boilerplates/3dyonic`}</pre>
      <h2 className="text-xl font-semibold">MCP</h2>
      <p>The server runs no model. Tools: list_scopes, get_questions, get_option, check_recipe.</p>
      <pre className="overflow-auto rounded-control border border-line p-3 text-sm">{`uv run open-ds-mcp
uv run open-ds-mcp --http`}</pre>
      <h2 className="text-xl font-semibold">CLI</h2>
      <p>The package name open-ds is a placeholder and is not published.</p>
      <pre className="overflow-auto rounded-control border border-line p-3 text-sm">{`node cli/bin/open-ds.js init recipes/3dyonic.json --out ./my-ds
node cli/bin/open-ds.js check --dir ./my-ds`}</pre>
      <h2 className="text-xl font-semibold">Site</h2>
      <pre className="overflow-auto rounded-control border border-line p-3 text-sm">{`pnpm --dir site dev
pnpm --dir site build`}</pre>
      <p>
        Add a question in a pack JSON file. Give every option why, when_to_choose, trade_offs, and
        sources. Give every purpose effect a reason. See CONTRIBUTING.md.
      </p>
    </div>
  );
}
