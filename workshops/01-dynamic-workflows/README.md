# Workshop 01 — Dynamic workflows

A dynamic workflow is a JavaScript harness that Claude Code writes for your task. The harness starts many agents. Each agent has a clean context and one small goal. This workshop teaches you when a workflow helps and how to ask for one.

## Contents

| Path | What it is |
|------|-----------|
| `slides-skills-and-workflows-workshop-1.pdf` | The slides from the workshop. |
| `prompts.html` | The prompt sheet as a web page. Click a prompt to copy it. This is the digital handout. |
| `prompts-onepager.pdf` | The same sheet as one page, for print. The LaTeX source is next to it. |
| `PROMPTS.md` | The same prompts as plain text, readable on GitHub. |
| `diagrams/` | 13 workflow-pattern diagrams. Each PNG has its HTML source next to it. |
| `diagram-editor/` | A one-file HTML editor for these diagrams, and the prompt that created it. |
| `explainer/` | A reference page for the Workflow tool, in Simplified Technical English. |
| `skills/workflow-diagram/` | A Claude Code skill that draws diagrams in this style. |
| `case-study-diagram-tournament/` | A complete worked run: a knockout + evolve tournament that redesigned John Snow's 1854 cholera map. The workflow script, the brief, all 14 figures, the bracket, and slide-ready PNGs. |

## How to start

1. Open `prompts-onepager.pdf`.
2. Pick one prompt near your current work.
3. Paste it into Claude Code. Change the details to match your project.
4. Type `/workflows` to watch the run.


## The editor

Open `diagram-editor/diagram-editor.html` in a browser. No server is necessary.

- Drag a box to move it. Drag the orange corner to resize it.
- Click a box or an arrow to edit it in the panel.
- Click **Connect**, then a source box, then a target box, to add an arrow.
- Export PNG, SVG, or JSON from the toolbar.

The file `diagram-editor/PROMPT.md` shows the prompt that created this tool. This is the lesson: you can ask Claude to build your tools.

## The skill

Copy `skills/workflow-diagram/` into `~/.claude/skills/`. Then any Claude Code session can draw diagrams in this style. Read the SKILL.md — it is also an example of how to write a skill.
