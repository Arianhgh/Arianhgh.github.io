---
title: STREAM-MARL
slug: stream-marl
category: Reinforcement learning
year: '2026'
summary: A streaming multi-agent learner designed to update from each transition once and then discard it.
contribution: Co-developed the replay-free actor-critic method, its training procedure, and its evaluation.
result: One use per transition; 210.6 MiB peak memory in the reported comparison.
sourceLabel: Public research abstract
sourceUrl: https://lassonde.yorku.ca/research/lassonde-undergraduate-research-conference-2026-researchers
order: 1
---

## The question

Many multi-agent reinforcement learning methods rely on storing and revisiting experience. We asked what learning could look like when memory and transition reuse are real constraints.

## The approach

I co-developed a centralized-training, decentralized-execution actor-critic that processes each transition once, updates immediately, and discards it. The method combines eligibility traces, online normalization, and entropy-based exploration so that the constraint is part of the learning design.

## What we observed

<figure>
  <a href="../../images/stream-learning-curves.png"><img src="../../images/stream-learning-curves.png" alt="Learning curves comparing STREAM-MARL with multi-agent reinforcement learning baselines on Balance, Sampling, and Navigation tasks" width="1441" height="584" loading="lazy" /></a>
  <figcaption>Learning curves from the STREAM-MARL manuscript. STREAM-MARL is the thick purple line; each task uses its own reward scale. Open the figure to inspect it at full size.</figcaption>
</figure>

In one reported comparison, STREAM-MARL used 210.6 MiB of peak resident memory. The public research abstract also reports reaching a high-success navigation threshold about four times sooner than MAPPO and IPPO in its evaluated setting. Those numbers describe specific experiments, not general guarantees.

The broader question still interests me: what becomes possible when we treat practical limits as part of the research problem?
