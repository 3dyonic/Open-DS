"""Open DS MCP server.

Tools: list_schemes, get_scheme, get_answer, why, when_to_use and deploy.
deploy runs the open-ds CLI, so an agent and a person get the same result.
Every tool returns plain JSON with the reasons attached.
"""

from __future__ import annotations

from pathlib import Path
from typing import Annotated, Literal

from fastmcp import FastMCP
from pydantic import Field

from open_ds_mcp import schemes as sch

mcp = FastMCP(
    "open-ds",
    instructions=(
        "Open DS: design systems as answered questions. Start with list_schemes and pick the scheme "
        "whose use_when fits the product. deploy copies its tokens, components, AGENTS.md and agent "
        "skill into a project. While building UI, call when_to_use before choosing a component or "
        "token, and why to explain a decision."
    ),
)

SchemeId = Annotated[
    str,
    Field(description="Scheme id: dense-data, content-first, accessible-first, multi-brand or brand-expressive."),
]


@mcp.tool
def list_schemes() -> list[dict]:
    """List the Open DS schemes with what each is for.

    Each item has id, name, summary, use_when, avoid_when, example_products and
    brands. Read use_when and avoid_when to pick the scheme that fits the product.
    """
    out = []
    for scheme_id in sch.scheme_ids():
        s = sch.load_scheme(scheme_id)
        out.append(
            {
                "id": s["id"],
                "name": s["name"],
                "summary": s["summary"],
                "use_when": s["ai"]["use_when"],
                "avoid_when": s["ai"]["avoid_when"],
                "example_products": s["ai"]["example_products"],
                "brands": list(s["tokens"]["brands"]),
                "status": s["status"],
            }
        )
    return out


@mcp.tool
def get_scheme(
    scheme_id: SchemeId,
    part: Annotated[
        Literal["summary", "answers", "usage", "voice", "tokens", "all"],
        Field(description="Which part to return. summary is small; all is the whole scheme file."),
    ] = "summary",
) -> dict:
    """Return one scheme, or one part of it.

    summary: name, description, ai guidance, scenarios, themes and voice summary.
    answers: every grammar question answered, with why and because.
    usage: the rule for every situation (use, not, why).
    voice: the voice outputs (summary, principles, words), each with the answers it follows.
    The tone per moment is in usage, under the voice situations. tokens: the DTCG tokens. all: everything.
    """
    s = sch.load_scheme(scheme_id)
    if part == "all":
        return s
    if part == "summary":
        return {
            "id": s["id"],
            "name": s["name"],
            "description": s["description"],
            "ai": s["ai"],
            "scenarios": s["scenarios"],
            "themes": s["themes"],
            "voice": s["voice"]["summary"],
        }
    return {"id": s["id"], part: s[part]}


@mcp.tool
def get_answer(
    scheme_id: SchemeId,
    question_id: Annotated[
        str, Field(description="Grammar question id, for example typography.definition or people.q1.")
    ],
) -> dict:
    """Return how a scheme answers one grammar question.

    Gives the question, the chosen option, the reason (why), and the earlier
    answers it follows from (because), each with its own option and reason.
    """
    s = sch.load_scheme(scheme_id)
    qs = sch.questions()
    if question_id not in qs:
        raise ValueError(f"Unknown question id '{question_id}'. Ids look like typography.definition.")
    answers = {a["question"]: a for a in s["answers"]}

    def describe(qid: str) -> dict:
        a = answers[qid]
        option = next(o for o in qs[qid]["options"] if o["id"] == a["option"])
        return {"question": qid, "text": qs[qid]["text"], "answer": option["label"], "why": a["why"]}

    return {**describe(question_id), "because": [describe(b) for b in answers[question_id]["because"]]}


@mcp.tool
def why(
    scheme_id: SchemeId,
    target: Annotated[
        str,
        Field(description="A question id (typography.definition) or a component key (button/primary/background)."),
    ],
) -> dict:
    """Explain a decision with its full chain of reasons.

    For a question id: the answer, its why, and the because chain back to the
    reasons. For a component key: the semantic it reads and its value in every
    brand and mode. Runs the open-ds CLI.
    """
    return sch.run_cli("why", scheme_id, target)


@mcp.tool
def when_to_use(
    scheme_id: SchemeId,
    situation: Annotated[
        str,
        Field(description="A situation id (number-in-table, commit-action) or plain words ('a number in a table')."),
    ],
) -> dict:
    """Return what to use, what not to use, and why, for a situation.

    Call this before you choose a component, variant or token. Runs the open-ds CLI.
    """
    return sch.run_cli("when", scheme_id, situation)


@mcp.tool
def deploy(
    scheme_id: SchemeId,
    project_dir: Annotated[str, Field(description="Absolute path of the project folder to write into.")],
    brand: Annotated[
        str | None,
        Field(description="Brand id for a multi-brand scheme (aster, birch or coral). Leave empty otherwise."),
    ] = None,
    overwrite: Annotated[
        bool,
        Field(description="Set true to replace the files of a project that already has a scheme."),
    ] = False,
    docs: Annotated[
        bool,
        Field(description="Set true to also write the design system's docs pages (Docusaurus) to docs/."),
    ] = False,
) -> dict:
    """Deploy a scheme into a project by running the open-ds CLI.

    Writes src/styles/open-ds.css (tokens, light and dark), the components in
    src/components/ui, AGENTS.md, the agent skill and open-ds.json. With docs=true it
    also writes the design system's docs pages to docs/. Returns the record and the
    next steps (packages to install, the CSS import).
    """
    if not Path(project_dir).is_absolute():
        raise ValueError(f"project_dir must be an absolute path. Got '{project_dir}'.")
    args = ["init", scheme_id, "--dir", project_dir]
    if brand:
        args += ["--brand", brand]
    if overwrite:
        args.append("--yes")
    if docs:
        args.append("--docs")
    try:
        record = sch.run_cli(*args)
    except ValueError as error:
        raise ValueError(
            str(error).replace("Run init again with --yes", "Call deploy again with overwrite=true")
        ) from error
    return {
        **record,
        "next_steps": [
            f"npm install {' '.join(record['dependencies'])}",
            "Import src/styles/open-ds.css after Tailwind in your main CSS file.",
            "Read AGENTS.md before you write UI.",
        ],
    }
