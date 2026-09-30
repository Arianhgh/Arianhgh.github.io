---
title: Vizir
slug: vizir
category: Data exploration
year: '2026'
summary: A Python-first library for exploring datasets and investigating model behavior through linked visual views.
contribution: Built notebook and offline HTML workflows, model diagnostics, linked selections, and a shared browser renderer.
result: Interactive exploration and model reports that can also be saved as standalone HTML.
sourceLabel: View the repository
sourceUrl: https://github.com/Arianhgh/Vizir
order: 3
---

## The idea

Patterns are easier to understand when you can move between a chart, the underlying records, and a model's errors. I wanted the same exploration to work in a notebook and in a report someone else could open without setting up a Python environment.

## What I built

Vizir provides dataset profiles, charts with linked selections, and views for classification and regression diagnostics. It supports projections, preprocessing inspection, and investigation across data subsets. A shared browser renderer powers the notebook view and standalone HTML export.

## What interests me about it

The useful moment is when a visual pattern leads to a better question: which records are behind it, whether it survives a different slice of the data, and what a model does with those cases.
