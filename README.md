# Open DS

<p align="center">
  <img src=".github/assets/hero.png" alt="Open DS: every design system is a set of answers. A question, its answer and the answers it follows from, next to five schemes (Dense data, Content first, Accessible first, Multi-brand, Brand expressive) built from the same components." width="100%" />
</p>

Open DS models a design system as a finite grammar of questions. A **scheme** answers every question with a reason, and deploys as a whole design system: tokens, components, Storybook, docs and an agent layer. Every value can say why it is the way it is.

The display name is the `name` field in [brand.json](brand.json). Nothing is published yet.

## How it works

- **Reasons** come first: the product, the people, the content, the tasks, the brand, the use scenarios.
- **Scopes** follow: typography, color, spacing, shape, elevation, motion, iconography, theming, accessibility, naming, voice and tone. Every scope answers the same five questions: roles, how many, how defined, values, lands in.
- **Tokens** follow from the answers (Style Dictionary, DTCG, light and dark for every brand).
- **Components** read only component keys, so a scheme changes how they look without changing their code.

Five schemes ship today: Dense data, Content first, Accessible first, Multi-brand and Brand expressive. The grammar and the schemes are in [schemes/](schemes/).

## Take a scheme

```bash
npx open-ds init dense-data
```

That is the command once the package is published. It writes the tokens, the components, `AGENTS.md`, the agent skill and, with `--docs`, the design system's own docs into your project. Until then, test the package locally: see [TESTING.md](TESTING.md).

## Work on Open DS

- [TESTING.md](TESTING.md): run every part locally, test the package, run the end-to-end check.
- [AGENTS.md](AGENTS.md): the repository layout and the rules.
- [guide/intro.md](guide/intro.md): the product, business, brand, CLI, MCP and agent notes.
- [CONTRIBUTING.md](CONTRIBUTING.md): how to change a scheme or propose a question.

## License

MIT. See [LICENSE](LICENSE).
