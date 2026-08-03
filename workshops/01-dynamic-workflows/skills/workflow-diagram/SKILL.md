---
name: workflow-diagram
description: Create Anthropic-style agent-workflow diagrams as PNGs (warm putty background, salmon In/Out terminals, green phase containers, gray agent boxes, dashed chevron arrows). Use when the user asks for a workflow/agent/orchestration diagram "in the usual style", mentions the workflow-diagrams set, or wants architecture PNGs matching the Anthropic multi-agent illustrations.
---

# workflow-diagram

Produce a PNG diagram of an agent workflow in the exact visual style of Anthropic's
sequential/parallel/evaluator-optimizer illustrations. Each diagram is a hand-written
SVG inside a minimal HTML page, rendered to PNG with headless Chrome.

**Interactive editor:** `~/learning/workflow-diagrams/diagram-editor.html` is a
single-file GUI for this style (drag nodes, edit labels, connect arrows, export
SVG/PNG/JSON). If the user wants to tweak a diagram by hand, open that instead of
hand-editing coordinates; for new diagrams authored by you, write SVG directly.

**Reference set:** `~/learning/workflow-diagrams/` holds 13 worked examples
(`NN-slug.html` + matching `.png`). Before drawing, open the closest one and crib its
coordinates — `05-composed-exhaustive-review.html` is the canonical two-phase vertical
composition; `01-adversarial-verify.html` is the canonical stacked fan/converge;
`12-experiment-optimizer.html` shows loops and conditional exits;
`04-pipeline-vs-barrier.html` shows the Gantt-lane variant for timing comparisons.

## Process

1. Pick a layout from the reference set; sketch box coordinates first (see cookbook).
2. Write `<slug>.html` (skeleton below) with the SVG at exact pixel size.
3. Render: 
   ```sh
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
     --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
     --window-size=2000,<H> --screenshot=<slug>.png "file://$PWD/<slug>.html"
   ```
   `--window-size` height must equal the SVG height.
4. **Always Read the PNG back and inspect it** for label/arrow collisions, text
   overflowing boxes, and arrowheads that miss their target. Fix and re-render.
   The most common defects: sub-labels wider than their box (~12.6px/char at 21px
   mono, ~13.7px/char at 27px), and mono annotations struck through by an arrow.

## Canvas

- Width always **2000**. Height to fit content + 65px bottom margin (1250–1950 typical).
- Background `#E9E8E1`; title centered at y≈118, 60px, weight 700, `#1C1C1A`,
  system sans (`-apple-system, 'Helvetica Neue', Arial, sans-serif`).
- Card: `<rect x="80" y="185" width="1840" height="H-250ish" rx="30" fill="#FAFAF6"/>`.

## Components (exact specs)

**In / Out terminals** (salmon): `rx=16 fill=#F7DCCE stroke=#C25E3F stroke-width=3`,
w=250 (320 for longer subs), h=145–150. Main label 40px weight 600 `#262624`
("In"/"Out"); sub 27px weight 500 `#C25E3F` naming the actual payload
("Paper draft", "Confirmed findings").

**Phase container** (green): `rx=30 fill=#DAE8D8 stroke=#6FA37C stroke-width=3`.
Optional phase tag, mono 21px `letter-spacing=2` fill `#5E9070`, uppercase
`PHASE · NAME`, at bottom-left inset (x+36, bottomY-32) — bottom-left, never top,
because fan arrows cross the top.

**Agent box** (gray): `rx=12 fill=#F1F1EB stroke=#85857D stroke-width=3`, w=300–450,
h=96–130. Main 31–32px weight 500 `#33332F`; sub mono 21px `#8A8A80`
(`'SF Mono', Menlo, monospace`) saying the agent's lens or job.

**Plain-code box** (oat — for non-agent script steps like dedup/gates/scorecards):
same shape but `fill=#F0E6D2 stroke=#C9A96A`, sub color `#97783A`, sub usually
"plain JS — …". This is the one color the originals don't have; it means
"free code between agent stages".

**Arrows**: `stroke=#8A8A82 stroke-width=3.5 stroke-dasharray="11 10" fill=none`
with this marker in `<defs>`:
```svg
<marker id="arr" viewBox="0 0 12 12" refX="8" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
  <path d="M2 1.5 L10 6 L2 10.5" fill="none" stroke="#82827A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
```

**Edge labels**: mono 22px `#8A8A80`, short ("new findings → next wave",
"big gap → escalate"), placed just above/beside their segment, never touching a
line or border.

## Arrow discipline (this is what makes it look right)

- **Vertical termination rule**: arrows entering a box from above must end pointing
  straight down. Cubic with the last control point directly above the endpoint:
  `M x1 y1 C x1 (y1+70) x2 (y2-80) x2 y2` — start vertical, end vertical, S-curve
  between. Same converging into a box: all heads vertical, endpoints spread across
  the target's top edge (e.g. at cx−75, cx, cx+75).
- **Side entries** (stacked-column layouts like `01`): end horizontally at the box's
  left edge; give the source ≥100px of horizontal run or the chevrons cramp.
- **Loops** run through a clear side channel: exit the box edge, `H` to x=250 (left)
  or x=1760/1780 (right) — *outside* the containers — `V` with `Q r=20` rounded
  corners, then re-enter the target edge. Label the loop on its horizontal run.
- **Conditional exits** from a gate: down = the "continue" path, side channel =
  the "done/bypass" path, each with a mono label.
- Arrows may cross container borders (the originals do); they must never cross
  text or other boxes.

## Layout cookbook (2000-wide canvas)

- **3-across row**: boxes w=300 at x=380/760/1140 (centers 530/910/1290), container
  x=300 w=1400.
- **4-across row**: boxes w=300 at x=340/700/1060/1420, container x=300 w=1460.
- **Stacked column + converge** (like `01`): boxes w=320–380 at x≈500–620, rows
  ~130px apart; In at cx≈380–505 top-left; converge target box to the right at
  the column's vertical center.
- **Vertical composition** (like `05`/`06`): In top-left (cx 505) → phase container
  (y 470, h 290) → oat box centered (x 850–1170, y 830) → second container
  (y 1015) → final gray box → Out centered at bottom. Spacing between bands ~60px.
- Center-column x for oat/vote/Out in vertical layouts: cx=1010.

## Skeleton

```html
<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0}</style>
<svg width="2000" height="{H}" viewBox="0 0 2000 {H}" xmlns="http://www.w3.org/2000/svg"
     font-family="-apple-system, 'Helvetica Neue', Arial, sans-serif">
<defs><!-- arr marker from above --></defs>
<rect width="2000" height="{H}" fill="#E9E8E1"/>
<text x="1000" y="118" text-anchor="middle" font-size="60" font-weight="700" fill="#1C1C1A">{Title}</text>
<rect x="80" y="185" width="1840" height="{H-250}" rx="30" fill="#FAFAF6"/>
<!-- In terminal, containers, agent boxes, oat gates, arrows, Out terminal -->
</svg>
```

## Content rules

- Box labels are roles ("Finder 2", "Adjudicator", "Judge panel"), subs are the
  distinguishing lens or job in ≤3 mono words — the sub is where the teaching lives.
- In/Out subs name concrete payloads, not abstractions.
- No emojis, no gradients, no shadows, one accent family (salmon) + one structure
  family (green) + oat for plain code. Titles are "{Pattern-name} workflow".
- Deliverables: keep the `.html` next to the `.png` so relabeling is an edit +
  re-render, and save both to `~/learning/workflow-diagrams/` (numbered `NN-slug`)
  unless the user names another location.
