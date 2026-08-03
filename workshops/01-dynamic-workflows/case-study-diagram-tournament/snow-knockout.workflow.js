export const meta = {
  name: 'snow-knockout',
  description: 'Knockout+evolve tournament: 8 seeded redesigns of John Snow 1854 cholera map, blind pairwise judging, winners revise with inherited critiques',
  phases: [
    { title: 'Draw', detail: '8 entrants, one distinct design brief each, real 1854 data' },
    { title: 'Quarterfinal', detail: '4 blind matches x 3 judge lenses, winners evolve' },
    { title: 'Semifinal', detail: '2 matches, winners evolve again' },
    { title: 'Final', detail: 'champion decided' },
    { title: 'Gallery', detail: 'comparison page with judge trail' },
  ],
}

const BASE = '/Users/joshlawman/kb/teaching/reasoning-with-machines-lab/tournament/snow'
const DATA = `${BASE}/data`

const DATA_NOTE = `
REAL DATA (you MUST plot from these files, programmatically — no invented positions):
- ${DATA}/Snow.deaths.csv  — 578 cholera deaths: case, x, y (coords in ~100m units on Snow's map plane, y increases north)
- ${DATA}/Snow.pumps.csv   — 13 water pumps: pump, label, x, y (pump 7 "Broad St" is THE pump)
- ${DATA}/Snow.streets.csv — 1241 street polyline points: street (segment id), n, x, y (group rows by street id, connect points in order)
- ${DATA}/Snow.dates.csv   — daily epidemic curve Aug 19–Sep 30 1854: date, attacks, deaths (Snow removed the pump handle Sep 8)
No population denominator exists in this data — if your design implies rates, be honest about that limitation.`

const CRAFT = `
DELIVERABLE RULES:
- One standalone SVG file, self-contained (no external images/fonts/scripts; system font stacks fine), roughly 1000-1400px wide, that renders correctly when opened directly in a browser.
- Generate it with a Python script (write the script next to the SVG, run it with python3; matplotlib is fine but export clean SVG, or build the SVG directly). Do not hand-place 578 dots.
- Typography, colour and line-weight discipline of a serious publication figure. A title and a takeaway are part of the design.
- VERIFY VISUALLY before returning: rasterize your SVG (e.g. "qlmanage -t -s 1600 <file> -o <dir>" on this Mac, or a headless browser screenshot, or cairosvg if installed) and Read the PNG. Fix what looks wrong. Do not return an entry you have not looked at.`

const MISSION = `You are one entrant in a design tournament. The subject: John Snow's 1854 Broad Street cholera map — the founding diagram of epidemiology. Your job is to produce a BETTER version: one that makes the pump argument faster to grasp, is honest to the data, and would survive a Nature-standard figure review. Its known flaws: per-address tally bars are impossible to compare across streets; no denominator; the walking-distance boundary was a retrofit. Beat it.`

const BRIEFS = {
  A: 'Brief: FAITHFUL MODERNIZATION. Keep Snow\'s spatial idiom — map, streets, marks at addresses — but redesign every encoding decision with modern craft: mark form, size scaling, layering, labeling, colour. The reader should feel it is still Snow\'s map, only legible.',
  B: 'Brief: DATA-FORWARD ANALYTIC. Bring analysis into the figure: nearest-pump allocation (Voronoi or walking-graph approximation over the street network), counts attributed per pump, distance-decay from the Broad St pump. The argument should be statistical, not just spatial.',
  C: 'Brief: MINIMALIST. Ruthless reduction. The fewest marks that still force the conclusion. Generous whitespace, one accent colour maximum, no decoration. Every remaining element must be load-bearing.',
  D: 'Brief: EDITORIAL / ANNOTATED NARRATIVE. A figure that tells the story to a lay reader: layered annotations, the Sep 8 handle removal, the brewery workers who drank beer and lived, the widow in Hampstead who had Broad St water delivered. Guide the eye in a forced order. (Historical annotations must be accurate.)',
  E: 'Brief: SMALL MULTIPLES / TIME. Use Snow.dates.csv — the dimension the original ignores. Space AND time: epidemic curve, before/after the handle removal, or weekly spatial panels (dates lack per-death location linkage, so be honest: aggregate curve + spatial total, or principled framing).',
  F: 'Brief: LAYERED INFORMATION DESIGN. Design it like a great modern interactive would look in its resting state: a primary map view plus coordinated marginal views (curve strip, per-pump bar rail), consistent linked colour encoding across views. Static SVG, but composed as an information system.',
  G: 'Brief: NATURE HOUSE STYLE. A two-panel (a/b) figure formatted to Nature specs: 183mm double column, 5-7pt effective type, restrained palette, panel labels, caption block set in the figure margin. It should look ready to drop into a Nature Medicine historical-epidemiology paper.',
  H: 'Brief: WILDCARD. Any form you can defend — polar, cartogram, flow, typographic, hybrid. Take one real aesthetic risk. It must still be honest to the data and readable in eight seconds; a beautiful failure loses in round one.',
}

const ENTRY_SCHEMA = {
  type: 'object', required: ['file', 'title', 'thesis'], additionalProperties: false,
  properties: {
    file: { type: 'string', description: 'absolute path of the final SVG' },
    title: { type: 'string' },
    thesis: { type: 'string', description: 'one sentence: what this design argues and how' },
  },
}

const VERDICT_SCHEMA = {
  type: 'object', required: ['winner', 'scoreFirst', 'scoreSecond', 'critiqueFirst', 'critiqueSecond'], additionalProperties: false,
  properties: {
    winner: { type: 'string', enum: ['first', 'second'] },
    scoreFirst: { type: 'number', description: '0-10' },
    scoreSecond: { type: 'number', description: '0-10' },
    critiqueFirst: { type: 'string', description: '2-4 sentences: strongest quality, worst flaw, one concrete fix' },
    critiqueSecond: { type: 'string', description: 'same for the second entry' },
  },
}

const EVOLVE_SCHEMA = {
  type: 'object', required: ['file', 'changes'], additionalProperties: false,
  properties: {
    file: { type: 'string' },
    changes: { type: 'string', description: 'what you changed and which critiques you acted on' },
  },
}

const LENSES = [
  { key: 'accuracy', brief: 'Lens: DATA HONESTY. Open both SVGs and read their source. Are the 578 deaths, 13 pumps and streets actually plotted from the data? Do encodings distort (area/length lies, cherry-picked framing, implied rates without denominators)? Are annotations factually right? Penalize dishonesty hard.' },
  { key: 'craft', brief: 'Lens: CRAFT. Rasterize both (qlmanage -t -s 1600 <file> -o <dir>, then Read the PNGs). Typography and hierarchy, colour discipline, line weights, alignment, label collisions, whitespace. Would a Nature art editor accept it?' },
  { key: 'firstglance', brief: 'Lens: FIRST GLANCE. Rasterize both, give each eight seconds. What claim did you take away — was it "the Broad Street pump is the source"? Is reading order forced? Could a smart reader outside epidemiology get it without a caption?' },
]

function judgePrompt(lens, fileFirst, fileSecond) {
  return `You are one of three blind judges in a diagram tournament (subject: improving John Snow's 1854 cholera map; ground-truth data in ${DATA}/ — deaths, pumps, streets, daily counts CSVs).
Two anonymous entries:
- first:  ${fileFirst}
- second: ${fileSecond}
${lens.brief}
You must inspect the RENDERED figures, not just the markup. Pick exactly one winner under your lens. Be a harsh, specific critic — your critiques are handed to the survivors to improve with.`
}

async function runMatch(m, phaseTitle) {
  const verdicts = (await parallel(LENSES.map(l => () =>
    agent(judgePrompt(l, m.first.file, m.second.file), {
      label: `judge:${l.key}:${m.id}`, phase: phaseTitle, schema: VERDICT_SCHEMA })
  ))).filter(Boolean)
  let vFirst = 0, vSecond = 0, sFirst = 0, sSecond = 0
  for (const v of verdicts) {
    if (v.winner === 'first') vFirst++; else vSecond++
    sFirst += v.scoreFirst; sSecond += v.scoreSecond
  }
  const firstWins = vFirst !== vSecond ? vFirst > vSecond : sFirst >= sSecond
  const winner = firstWins ? m.first : m.second
  const loser = firstWins ? m.second : m.first
  const critsWinner = verdicts.map(v => firstWins ? v.critiqueFirst : v.critiqueSecond)
  const critsLoser = verdicts.map(v => firstWins ? v.critiqueSecond : v.critiqueFirst)
  log(`${phaseTitle} ${m.id}: ${winner.seed} beats ${loser.seed} (${Math.max(vFirst, vSecond)}-${Math.min(vFirst, vSecond)} lenses)`)
  return { winner, loser, critsWinner, critsLoser, verdicts, votes: [vFirst, vSecond] }
}

async function evolve(res, round, phaseTitle) {
  const outFile = `${BASE}/entries/${round}-${res.winner.seed}.svg`
  const ev = await agent(`${MISSION}
${DATA_NOTE}
${CRAFT}
You are the surviving designer of tournament entry ${res.winner.file} ("${res.winner.title}" — thesis: ${res.winner.thesis}). It just won its match. Before the next round you must REVISE it, absorbing the judges' feedback:
CRITIQUES OF YOUR ENTRY:
${res.critsWinner.map((c, i) => `- (${LENSES[i % 3].key}) ${c}`).join('\n')}
CRITIQUES OF YOUR DEFEATED OPPONENT (steal what they were praised for, avoid what sank them):
${res.critsLoser.map((c, i) => `- (${LENSES[i % 3].key}) ${c}`).join('\n')}
Keep your design's identity — evolve it, don't replace it. Write the revised standalone SVG to exactly: ${outFile} (regenerate via your Python script; the original entry's generator script is in the same directory — read and reuse it). Verify visually as before.`,
    { label: `evolve:${res.winner.seed}`, phase: phaseTitle, schema: EVOLVE_SCHEMA })
  return { ...res.winner, file: (ev && ev.file) || outFile, evolved: ev ? ev.changes : 'evolve agent failed; unrevised file advances' }
}

// ── Round 1: draw ──────────────────────────────────────────────
phase('Draw')
const seeds = Object.keys(BRIEFS)
const entries = await parallel(seeds.map(s => () =>
  agent(`${MISSION}
${BRIEFS[s]}
${DATA_NOTE}
${CRAFT}
Write your Python generator to ${BASE}/entries/gen-${s}.py and the final SVG to exactly: ${BASE}/entries/${s}.svg`,
    { label: `draw:${s}`, phase: 'Draw', schema: ENTRY_SCHEMA })
    .then(e => e && { seed: s, ...e, file: `${BASE}/entries/${s}.svg` })
))

const live = entries.filter(Boolean)
log(`Draw complete: ${live.length}/8 entries delivered`)
if (live.length < 2) return { error: 'not enough entries survived the draw', live }

// seed-order pairings 1v8, 4v5, 2v7, 3v6 over whoever survived
const bySeed = Object.fromEntries(live.map(e => [e.seed, e]))
const order = ['A', 'H', 'D', 'E', 'B', 'G', 'C', 'F'].filter(s => bySeed[s]).map(s => bySeed[s])
const pairs = []
for (let i = 0; i + 1 < order.length; i += 2) pairs.push({ id: `QF${pairs.length + 1}`, first: order[i], second: order[i + 1] })
const byes = order.length % 2 ? [order[order.length - 1]] : []

// ── Quarterfinals: judge + evolve, pipelined per match ─────────
phase('Quarterfinal')
const trail = []
const qfWinners = (await pipeline(pairs,
  m => runMatch(m, 'Quarterfinal').then(r => { trail.push({ round: 'QF', match: m.id, winner: r.winner.seed, loser: r.loser.seed, votes: r.votes, verdicts: r.verdicts }); return r }),
  r => evolve(r, 'qf', 'Quarterfinal')
)).filter(Boolean).concat(byes)
log(`Semifinalists: ${qfWinners.map(w => w.seed).join(', ')}`)

// ── Semifinals ─────────────────────────────────────────────────
phase('Semifinal')
const sfPairs = []
for (let i = 0; i + 1 < qfWinners.length; i += 2) sfPairs.push({ id: `SF${sfPairs.length + 1}`, first: qfWinners[i], second: qfWinners[i + 1] })
const sfByes = qfWinners.length % 2 ? [qfWinners[qfWinners.length - 1]] : []
const sfResults = (await pipeline(sfPairs,
  m => runMatch(m, 'Semifinal').then(r => { trail.push({ round: 'SF', match: m.id, winner: r.winner.seed, loser: r.loser.seed, votes: r.votes, verdicts: r.verdicts }); return r }),
  r => evolve(r, 'sf', 'Semifinal')
)).filter(Boolean)
const finalists = sfResults.concat(sfByes)
const sfLosers = trail.filter(t => t.round === 'SF').map(t => t.loser)

// ── Final ──────────────────────────────────────────────────────
phase('Final')
let champion = finalists[0], runnerUp = null, finalRes = null
if (finalists.length >= 2) {
  finalRes = await runMatch({ id: 'FINAL', first: finalists[0], second: finalists[1] }, 'Final')
  trail.push({ round: 'F', match: 'FINAL', winner: finalRes.winner.seed, loser: finalRes.loser.seed, votes: finalRes.votes, verdicts: finalRes.verdicts })
  champion = finalRes.winner; runnerUp = finalRes.loser
}
log(`CHAMPION: seed ${champion.seed} — ${champion.title}`)

// ── Gallery ────────────────────────────────────────────────────
phase('Gallery')
const galleryFile = `${BASE}/bracket.html`
await agent(`Build a single self-contained HTML page at exactly ${galleryFile}: the results gallery of a knockout diagram tournament ("Beating John Snow's cholera map", Reasoning with Machines Lab teaching demo).
Content, in order: (1) champion, hero treatment; (2) the final four side by side; (3) the full bracket with every match's lens votes; (4) the judge trail — every critique, attributed to its lens, grouped by match; (5) all 8 round-1 entries as a contact sheet with each brief named (A faithful-modernization, B data-forward, C minimalist, D editorial, E small-multiples, F layered-info, G nature-house-style, H wildcard).
Inline every SVG (read each file and embed its markup; namespace/scope any <style> or id collisions between embedded SVGs). Round-1 files: ${BASE}/entries/{A..H}.svg; evolved files as given below. Design the page itself well — archival palette, serif display, restrained. It must work offline as one file.
TOURNAMENT RESULT JSON:
${JSON.stringify({ champion, runnerUp, sfLosers, trail, entries: live.map(e => ({ seed: e.seed, title: e.title, thesis: e.thesis, file: e.file })) }, null, 2)}`,
  { label: 'gallery', phase: 'Gallery' })

return { champion, runnerUp, trail, gallery: galleryFile, entries: live.map(e => ({ seed: e.seed, title: e.title })) }