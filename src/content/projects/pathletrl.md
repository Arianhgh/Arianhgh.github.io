---
title: PathletRL++
slug: pathletrl
category: Trajectory data & reinforcement learning
year: '2026'
summary: Using reinforcement learning to find smaller, more useful representations of movement through a city.
contribution: Co-developed the pathlet extraction and dictionary-formation method, including the learning formulation and evaluation.
result: Up to 65.8% smaller dictionaries in the paper's evaluated configurations.
sourceLabel: ACM publication
sourceUrl: https://doi.org/10.1145/3801963
order: 2
---

## The problem

Large collections of trajectories are difficult to store, compare, and reason about. A pathlet dictionary offers a compact vocabulary of frequently useful route segments, but deciding which segments belong in that vocabulary is a difficult optimization problem.

## Our approach

PathletRL++ treats extraction and dictionary formation as sequential decisions. I co-developed the reinforcement learning formulation and evaluated the resulting dictionaries on trajectory data from Toronto and Rome.

## What we learned

The paper reports up to 65.8% smaller dictionaries in evaluated configurations while preserving reconstruction quality. It also reports substantially lower initial memory in a specific comparison. The result is about a practical tradeoff: keep useful movement structure while reducing the representation's weight.
