# Case study — a knockout tournament for a better diagram

This folder shows one complete run of a **knockout + evolve** workflow. The task: redesign John Snow's 1854 Broad Street cholera map. Eight agents drew competing versions from the real data. Blind judge panels eliminated one design per match. Each winner had to revise its figure using the judges' critiques of **both** entries — its own and its beaten opponent's — before the next round.

One run: 36 agents, 7 blind matches, 21 verdicts, 74 minutes end to end.

## Contents

| Path | What it is |
|------|-----------|
| `snow-knockout.workflow.js` | The workflow script that ran the whole tournament. Read it top to bottom — it is the lesson. |
| `slides/` | 11 slide-ready PNGs (16:9) telling the story: harness diagram, the draw, the bracket, the evolve mechanic, the champion, the final four, and a before/after pair. The harness diagram's HTML source is next to its PNG. |
| `variants/` | All 14 figures as clean PNGs: the 8 round-1 entries plus every evolved revision. Files sort by lineage: `E-…`, `E-…-rev1`, `E-…-rev2-CHAMPION`. |
| `bracket.html` | The full results gallery: every figure inline, every critique, every vote. One self-contained file; open it in a browser. |

## The brief given to every entrant

> Redesign John Snow's 1854 Broad Street cholera map so the argument — *the pump is the source* — lands in eight seconds, survives a Nature-standard figure review, and stays honest to the data.
>
> You get: 578 deaths with coordinates, 13 named pumps, 1,241 street segments, and the daily epidemic curve (19 Aug – 30 Sep 1854; handle removed 8 Sep). There is no population denominator — that is part of the problem.
>
> Known flaws to beat: per-address tally bars that cannot be compared across streets; a "walking distance" boundary that was drawn by hand, after the fact; counts masquerading as risk.
>
> Deliverable: one publication-grade SVG, generated from the data by a script. Nothing hand-placed. Every printed number computed. Rasterize your figure and look at it before you submit.

Each entrant also got one sealed design brief that the others never saw: faithful modernization, data-forward analytic, minimalist, editorial narrative, small multiples / time, layered information, Nature house style, wildcard. Eight briefs means diversity by construction, not by chance.

## How the judging worked

Every match: two anonymous entries, three judges, one lens each.

- **Data honesty** — are the 578 deaths really plotted from the data? Do encodings distort?
- **Craft** — rasterize both and inspect. Would a journal art editor accept it?
- **First glance** — eight seconds. Did you take away the right claim?

Majority wins. The loser is out. The winner inherits all six critiques and must revise before its next match, keeping its design identity.

## The result

| Round | Match | Votes |
|-------|-------|-------|
| QF | A (faithful) beats H (wildcard) | 2–1 |
| QF | E (small multiples) beats D (editorial) | 3–0 |
| QF | G (Nature style) beats B (data-forward) | 2–1 |
| QF | F (layered info) beats C (minimalist) | 2–1 |
| SF | E beats A | 2–1 |
| SF | F beats G | 2–1 |
| Final | **E beats F** | 2–1 |

The champion's best moves were inherited from beaten opponents — colour discipline from the faithful entry, numerator/denominator honesty from the layered-information entry. That is the point of the evolve step.

## Run it yourself

The script needs the Snow dataset as four CSV files (deaths, pumps, streets, daily counts). Get them from the HistData collection:

```sh
mkdir -p data && cd data
for f in Snow.deaths Snow.pumps Snow.streets Snow.dates; do
  curl -sfO "https://vincentarelbundock.github.io/Rdatasets/csv/HistData/$f.csv"
done
```

Then edit the `BASE` and `DATA` paths at the top of `snow-knockout.workflow.js` and ask Claude Code to run it with the Workflow tool. To point the same harness at a different subject — we ran it on the Transformer architecture diagram next — swap the `MISSION`, `BRIEFS`, and judge lens texts. The bracket machinery does not change.
