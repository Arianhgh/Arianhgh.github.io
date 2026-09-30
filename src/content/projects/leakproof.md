---
title: Leakproof
slug: leakproof
category: ML evaluation
year: '2026'
summary: A Python tool that checks for data leakage and evaluation mistakes before they distort a result.
contribution: Built the static, dataset, and runtime analysis layers, along with reports and CI integration.
result: Checks across code, data splits, and runtime behavior, with coverage and findings made explicit.
sourceLabel: View the repository
sourceUrl: https://github.com/Arianhgh/Leakproof
order: 2
---

## The problem

A model can look convincing for the wrong reason. Leakage between training and test data, preprocessing in the wrong order, or repeated decisions against the test set can make an evaluation look stronger than it is.

## What I built

Leakproof looks for these problems in source code, declared datasets, and supported runtime workflows. It checks split hygiene, preprocessing, temporal and target leakage, and related evaluation risks. Findings can be reviewed in terminal, JSON, Markdown, or SARIF reports and used in CI.

## A design choice

The tool reports where analysis is incomplete. A clean scan is evidence about the rules it checked, not a certificate that the whole methodology is valid. That distinction matters when a tool is meant to help people trust their results.
