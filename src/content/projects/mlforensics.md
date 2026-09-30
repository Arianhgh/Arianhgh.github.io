---
title: MLForensics
slug: mlforensics
category: ML reliability
year: '2026'
summary: A local-first Python toolkit for understanding why a machine learning run changed or failed.
contribution: Designed and built the run capsule format, comparison tools, replay and debugging workflows, and CI checks.
result: Portable run evidence, paired-run comparisons, and debugging tools in an early alpha release.
sourceLabel: View the repository
sourceUrl: https://github.com/Arianhgh/MLForensics
order: 1
---

## The problem

When a model's result changes, the metric alone rarely explains why. The code, data, environment, and randomness may all have moved at once. I wanted a way to keep the evidence from a run together so a regression could be investigated rather than guessed at.

## What I built

MLForensics captures a run in a portable capsule with its metrics, environment, data fingerprints, and failure evidence. It can compare runs, replay inputs, trace tensors, and help shrink a failure into a smaller reproducible case. Its CI checks can flag a regression when repeated runs provide enough evidence.

## Where it stands

The project is an early alpha. Its capsule format is versioned, while public APIs may still change. I built it to make machine learning experiments easier to inspect and discuss with evidence.
