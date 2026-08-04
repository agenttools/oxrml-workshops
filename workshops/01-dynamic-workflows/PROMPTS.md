# Prompts to try

Ask for a workflow in your own words, or write **ultracode**. Change the details to match your project.

Patterns you will see: classify-and-act · fan-out-and-synthesize · adversarial verification · generate-and-filter · tournament · loop-until-done.

## Your paper

> Use a workflow to check each citation in my draft. Read each cited paper. Flag each claim that its source does not support.

> Run a workflow with four reviewers: methodology, missing baselines, statistics, novelty. Rank the criticisms. Give me a fix list.

> Trace each number in my abstract to a table and to the eval script. Flag each number that you cannot trace.

> Go through my draft and verify every technical claim against the codebase with a workflow. I do not want to ship anything wrong.

## Your code

> Use a workflow to hunt for silent bugs in my training code: data leakage, eval contamination, masking errors, seed problems. Keep only the bugs that get a failing ten-line test.

> Use a workflow to check each equation in the paper against the function that implements it.

> This test fails maybe 1 in 50 runs. Set up a workflow to reproduce it. Form competing theories about the race. Do not stop until one theory survives the evidence.

> Use a workflow to rename `Encoder` to `Backbone` everywhere, one worktree per module, with an adversarial review before merge.

## Your experiments

> Run a workflow that tunes my proxy run until val loss is below 2.10 or a 500k token budget is gone. Change one thing per wave. Build an HTML report at the end.

> Why did run 41 diverge? Spawn agents that make hypotheses from the logs, the config, and the data — separately. Then let refuters attack each hypothesis.

> Use a workflow to read this finished sweep and build a one-page HTML explainer: curves, ablations, failure cases.

## The literature

> Use a workflow to sweep for related work: by keyword, by author, by citation graph, by venue. Stop when two waves find nothing new.

> Take these 12 papers. Extract the core claims. Show me where the papers disagree, and whether their setups differ.

> Before I adopt this benchmark, use a workflow to check for contamination reports, label errors, and saturation.

## Judging with a rubric

> Here is my rubric. Score my chapter with one judge per criterion. Each score must cite evidence from the text.

> Have two agents mark each submission blind against the rubric. Escalate only the criteria where they disagree.

> Sort these 200 error cases by severity with a tournament of pairwise judges.

> Interview me with AskUserQuestion to build a rubric first. Then rank these 80 outputs against it and double-check the top ten.

## Taste and exploration

> I need a name for this method. Use a workflow to brainstorm many options and run a tournament to pick the top 3.

> Tear my research statement apart from an advisor's, a Reviewer-2's, and a grant panel's perspective.

> Quick workflow: adversarially check the assumption I just made.

## Build your own tools

> Create a single HTML tool where I can manually make diagrams like this. Seed it with one of the workflows. Let me move the nodes, edit the text, and add more nodes.

> Create a global skill that makes diagrams in this exact style, so any future session can draw one.

## Good to know

- You can suggest how many agents and of what type (e.g. use up to 20 sonnet agents for this, or use sonnet agents for the discovery layer and fable agents to solve the problem)
- Workflows run in the background. Type `/workflows` to watch. (As of Aug 3rd 2026 visibility is better in the terminal)
- Pair with `/loop` for repeated tasks and `/goal` for a hard finish line.
