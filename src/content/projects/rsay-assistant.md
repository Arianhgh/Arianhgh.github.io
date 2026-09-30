---
title: RSAY research assistant
slug: rsay-assistant
category: Applied AI engineering
year: '2025–2026'
summary: A source-grounded assistant that helps York students find research opportunities and answers with citations.
contribution: Built and deployed the retrieval system, evaluation workflow, guardrails, instrumentation, and streaming interface.
result: Reduced cold retrieval latency by 82% in the reported evaluation.
sourceLabel: Visit RSAY
sourceUrl: https://www.rsay.ca/
order: 3
---

## Why I built it

Research opportunities can be difficult to discover if you do not already know where to look. At the Research Society at York, I built an assistant to make that information easier for students to find and check.

## How it works

The assistant retrieves from source material using semantic and lexical search, combines results, and answers with inline citations. I added guardrails for unsupported answers, a labeled evaluation set, and instrumentation for the retrieval stages. The interface streams answers so students can start reading promptly.

## What changed

In the reported evaluation, conditional query rewriting, embedding caching, and retrieval-stage tuning reduced cold retrieval latency by 82%. I kept cross-encoder reranking optional after evaluating its quality and latency tradeoff for this application.

The lesson I carried away is that a useful AI system needs more than a plausible answer: it needs traceable sources, a way to test failures, and feedback from how people actually use it.
