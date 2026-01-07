# Web CSS Interoperability Report

This document outlines the CSS feature parity between iOS, Android, and Web for the `@triniwiz/nativescript-masonkit` project. The project aims to replicate web spec layouts in NativeScript using Taffy (a Rust-based layout engine).

## Overview

MasonKit implements a cross-platform layout engine that brings web-like CSS layout capabilities to NativeScript applications. The core layout engine is written in Rust and compiled for both iOS and Android platforms.

---

## CSS Properties

> **Legend:** ✅ Supported | ⚠️ Partial/Incomplete | ❌ Not Supported

### Display Modes

| Property                  | iOS | Android | Notes |
| ------------------------- | --- | ------- | ----- |
| `display: none`         | ✅  | ✅      |       |
| `display: flex`         | ✅  | ✅      |       |
| `display: grid`         | ✅  | ✅      |       |
| `display: block`        | ✅  | ✅      |       |
| `display: inline`       | ✅  | ✅      |       |
| `display: inline-block` | ✅  | ✅      |       |
| `display: inline-flex`  | ✅  | ✅      |       |
| `display: inline-grid`  | ✅  | ✅      |       |
| `display: table`        | ❌  | ❌      |       |
| `display: table-row`    | ❌  | ❌      |       |
| `display: table-cell`   | ❌  | ❌      |       |

### Position

| Property               | iOS | Android | Notes                                       |
| ---------------------- | --- | ------- | ------------------------------------------- |
| `position: relative` | ✅  | ✅      |                                             |
| `position: absolute` | ✅  | ✅      |                                             |
| `position: fixed`    | ❌  | ❌      | Viewport-relative positioning not available |
| `position: sticky`   | ❌  | ❌      | Scroll-aware positioning not available      |
| `position: static`   | ❌  | ❌      | Default behavior may differ                 |
| `z-index`            | ❌  | ❌      | Layer stacking control missing              |

### Box Model

| Property                     | iOS | Android | Notes |
| ---------------------------- | --- | ------- | ----- |
| `width`                    | ✅  | ✅      |       |
| `height`                   | ✅  | ✅      |       |
| `min-width`                | ✅  | ✅      |       |
| `min-height`               | ✅  | ✅      |       |
| `max-width`                | ✅  | ✅      |       |
| `max-height`               | ✅  | ✅      |       |
| `margin` (all sides)       | ✅  | ✅      |       |
| `padding` (all sides)      | ✅  | ✅      |       |
| `border-width` (all sides) | ✅  | ✅      |       |
| `box-sizing: border-box`   | ✅  | ✅      |       |
| `box-sizing: content-box`  | ✅  | ✅      |       |
| `aspect-ratio`             | ✅  | ✅      |       |

### Inset (top/right/bottom/left)

| Property              | iOS | Android | Notes |
| --------------------- | --- | ------- | ----- |
| `top`               | ✅  | ✅      |       |
| `right`             | ✅  | ✅      |       |
| `bottom`            | ✅  | ✅      |       |
| `left`              | ✅  | ✅      |       |
| `inset` (shorthand) | ✅  | ✅      |       |

### Flexbox Container

| Property                               | iOS | Android | Notes                                                    |
| -------------------------------------- | --- | ------- | -------------------------------------------------------- |
| `flex-direction`                     | ✅  | ✅      |                                                          |
| `flex-wrap`                          | ✅  | ✅      |                                                          |
| `flex-flow`                          | ⚠️  | ⚠️      | Must use `flex-direction` and `flex-wrap` separately |
| `justify-content`                    | ✅  | ✅      |                                                          |
| `align-items`                        | ✅  | ✅      |                                                          |
| `align-content`                      | ✅  | ✅      |                                                          |
| `gap` / `row-gap` / `column-gap` | ✅  | ✅      |                                                          |

### Flexbox Items

| Property             | iOS | Android | Notes                            |
| -------------------- | --- | ------- | -------------------------------- |
| `flex-grow`        | ✅  | ✅      |                                  |
| `flex-shrink`      | ✅  | ✅      |                                  |
| `flex-basis`       | ✅  | ✅      |                                  |
| `flex` (shorthand) | ⚠️  | ⚠️      | Must use individual properties   |
| `align-self`       | ✅  | ✅      |                                  |
| `order`            | ❌  | ❌      | Flex item ordering not supported |

### Grid Container

| Property                      | iOS | Android | Notes                                                         |
| ----------------------------- | --- | ------- | ------------------------------------------------------------- |
| `grid-template-rows`        | ✅  | ✅      |                                                               |
| `grid-template-columns`     | ✅  | ✅      |                                                               |
| `grid-template-areas`       | ✅  | ✅      |                                                               |
| `grid-template` (shorthand) | ⚠️  | ⚠️      | Must use individual properties                                |
| `grid` (shorthand)          | ⚠️  | ⚠️      | Must use individual properties                                |
| `grid-auto-rows`            | ✅  | ✅      |                                                               |
| `grid-auto-columns`         | ✅  | ✅      |                                                               |
| `grid-auto-flow`            | ✅  | ✅      |                                                               |
| `gap` / `grid-gap`        | ✅  | ✅      |                                                               |
| `justify-items`             | ✅  | ✅      |                                                               |
| `place-items`               | ⚠️  | ⚠️      | Must use `align-items` and `justify-items` separately     |
| `place-content`             | ⚠️  | ⚠️      | Must use `align-content` and `justify-content` separately |
| `subgrid`                   | ❌  | ❌      |                                                               |
| `masonry`                   | ❌  | ❌      | Experimental in web                                           |

### Grid Items

| Property              | iOS | Android | Notes                                                   |
| --------------------- | --- | ------- | ------------------------------------------------------- |
| `grid-column`       | ✅  | ✅      |                                                         |
| `grid-column-start` | ✅  | ✅      |                                                         |
| `grid-column-end`   | ✅  | ✅      |                                                         |
| `grid-row`          | ✅  | ✅      |                                                         |
| `grid-row-start`    | ✅  | ✅      |                                                         |
| `grid-row-end`      | ✅  | ✅      |                                                         |
| `grid-area`         | ✅  | ✅      |                                                         |
| `justify-self`      | ✅  | ✅      |                                                         |
| `place-self`        | ⚠️  | ⚠️      | Must use `align-self` and `justify-self` separately |

### Alignment

| Property            | iOS | Android | Notes |
| ------------------- | --- | ------- | ----- |
| `align-items`     | ✅  | ✅      |       |
| `align-self`      | ✅  | ✅      |       |
| `align-content`   | ✅  | ✅      |       |
| `justify-items`   | ✅  | ✅      |       |
| `justify-self`    | ✅  | ✅      |       |
| `justify-content` | ✅  | ✅      |       |
| `vertical-align`  | ✅  | ✅      |       |

### Overflow

| Property              | iOS | Android | Notes |
| --------------------- | --- | ------- | ----- |
| `overflow: visible` | ✅  | ✅      |       |
| `overflow: hidden`  | ✅  | ✅      |       |
| `overflow: scroll`  | ✅  | ✅      |       |
| `overflow: clip`    | ✅  | ✅      |       |
| `overflow: auto`    | ✅  | ✅      |       |
| `overflow-x`        | ✅  | ✅      |       |
| `overflow-y`        | ✅  | ✅      |       |
| `scrollbar-width`   | ✅  | ✅      |       |

### Typography

| Property                  | iOS | Android | Notes                        |
| ------------------------- | --- | ------- | ---------------------------- |
| `font-size`             | ✅  | ✅      |                              |
| `font-weight`           | ✅  | ✅      |                              |
| `font-style`            | ✅  | ✅      |                              |
| `font-family`           | ✅  | ✅      |                              |
| `font-variant`          | ❌  | ❌      |                              |
| `font-feature-settings` | ❌  | ❌      |                              |
| `color`                 | ✅  | ✅      |                              |
| `text-align`            | ✅  | ✅      |                              |
| `text-wrap`             | ✅  | ✅      |                              |
| `text-overflow`         | ✅  | ✅      |                              |
| `text-transform`        | ❌  | ❌      |                              |
| `text-decoration`       | ⚠️  | ⚠️      | Line, color, style supported |
| `text-indent`           | ⚠️  | ⚠️      | Limited support              |
| `text-shadow`           | ✅  | ✅      |                              |
| `text-orientation`      | ❌  | ❌      |                              |
| `letter-spacing`        | ✅  | ✅      |                              |
| `word-spacing`          | ❌  | ❌      |                              |
| `word-break`            | ❌  | ❌      |                              |
| `line-height`           | ✅  | ✅      |                              |
| `white-space`           | ✅  | ✅      |                              |
| `overflow-wrap`         | ❌  | ❌      |                              |
| `hyphens`               | ❌  | ❌      |                              |
| `writing-mode`          | ❌  | ❌      |                              |
| `direction`             | ⚠️  | ⚠️      | Basic support only           |

### Visual/Decorative

| Property                  | iOS      | Android | Notes                         |
| ------------------------- | -------- | ------- | ----------------------------- |
| `background`            | ✅       | ✅      |                               |
| `background-color`      | ✅       | ✅      |                               |
| `background-image`      | ✅       | ✅      |                               |
| `background-position`   | ❌       | ❌      |                               |
| `background-size`       | ❌       | ❌      |                               |
| `background-repeat`     | ❌       | ❌      |                               |
| `background-attachment` | ❌       | ❌      |                               |
| `background-clip`       | ❌       | ❌      |                               |
| `background-origin`     | ❌       | ❌      |                               |
| `linear-gradient`       | ⚠️       | ⚠️      | Basic support only            |
| `radial-gradient`       | ⚠️       | ⚠️      | Limited support               |
| `conic-gradient`        | ❌       | ❌      |                               |
| `border` (shorthand)    | ✅       | ✅      |                               |
| `border-radius`         | ✅       | ✅      |                               |
| `border-style`          | ✅       | ✅      |                               |
| `border-color`          | ✅       | ✅      |                               |
| `filter`                | ✅       | ✅      |                               |
| `backdrop-filter`       | ❌       | ❌      |                               |
| `object-fit`            | ✅       | ✅      |                               |
| `opacity`               | ~~⚠️~~ | ⚠️      | May be in native layer        |
| `visibility`            | ❌       | ❌      | Use `display: none` instead |
| `box-shadow`            | ❌       | ❌      |                               |
| `mix-blend-mode`        | ❌       | ❌      |                               |
| `clip-path`             | ❌       | ❌      |                               |
| `mask`                  | ❌       | ❌      |                               |
| `outline`               | ❌       | ❌      |                               |

### Float & Clear

| Property  | iOS | Android | Notes                                          |
| --------- | --- | ------- | ---------------------------------------------- |
| `float` | ⚠️  | ⚠️      | Basic support, complex interactions may differ |
| `clear` | ✅  | ✅      |                                                |

### Transforms & Animations

| Property             | iOS | Android | Notes                         |
| -------------------- | --- | ------- | ----------------------------- |
| `transform`        | ❌  | ❌      | Not in layout engine          |
| `transform-origin` | ❌  | ❌      |                               |
| `rotate`           | ❌  | ❌      |                               |
| `scale`            | ❌  | ❌      |                               |
| `translate`        | ❌  | ❌      |                               |
| `transition`       | ❌  | ❌      | CSS transitions not supported |
| `animation`        | ❌  | ❌      | CSS animations not supported  |
| `@keyframes`       | ❌  | ❌      |                               |

### Multi-column Layout

| Property         | iOS | Android | Notes                                |
| ---------------- | --- | ------- | ------------------------------------ |
| `columns`      | ❌  | ❌      |                                      |
| `column-count` | ❌  | ❌      |                                      |
| `column-gap`   | ⚠️  | ⚠️      | Works in grid/flex, not multi-column |
| `column-width` | ❌  | ❌      |                                      |
| `column-rule`  | ❌  | ❌      |                                      |
| `column-span`  | ❌  | ❌      |                                      |

### Table Layout

| Property            | iOS | Android | Notes |
| ------------------- | --- | ------- | ----- |
| `table-layout`    | ❌  | ❌      |       |
| `border-collapse` | ❌  | ❌      |       |
| `border-spacing`  | ❌  | ❌      |       |

### Sizing Functions

| Property          | iOS | Android | Notes                           |
| ----------------- | --- | ------- | ------------------------------- |
| `min-content`   | ⚠️  | ⚠️      | Partial support in grid context |
| `max-content`   | ⚠️  | ⚠️      | Partial support in grid context |
| `fit-content()` | ⚠️  | ⚠️      | Partial support                 |
| `calc()`        | ❌  | ❌      | TODO in codebase                |
| `clamp()`       | ❌  | ❌      |                                 |
| `min()`         | ❌  | ❌      |                                 |
| `max()`         | ❌  | ❌      |                                 |

### Selectors & Pseudo-elements

| Property           | iOS | Android | Notes                    |
| ------------------ | --- | ------- | ------------------------ |
| `::before`       | ❌  | ❌      |                          |
| `::after`        | ❌  | ❌      |                          |
| `::first-line`   | ❌  | ❌      |                          |
| `::first-letter` | ❌  | ❌      |                          |
| `:hover`         | ❌  | ❌      | Not applicable to mobile |
| `:focus`         | ⚠️  | ⚠️      | Through native focus     |
| `:active`        | ⚠️  | ⚠️      | Through native touch     |
| `content`        | ❌  | ❌      | No pseudo-elements       |

### Container Queries

| Property           | iOS | Android | Notes |
| ------------------ | --- | ------- | ----- |
| `container-type` | ❌  | ❌      |       |
| `container-name` | ❌  | ❌      |       |
| `@container`     | ❌  | ❌      |       |

### Scroll Behavior

| Property              | iOS | Android | Notes |
| --------------------- | --- | ------- | ----- |
| `scroll-behavior`   | ❌  | ❌      |       |
| `scroll-snap-type`  | ❌  | ❌      |       |
| `scroll-snap-align` | ❌  | ❌      |       |
| `scroll-margin`     | ❌  | ❌      |       |
| `scroll-padding`    | ❌  | ❌      |       |

### Other

| Property           | iOS | Android | Notes                    |
| ------------------ | --- | ------- | ------------------------ |
| `cursor`         | ❌  | ❌      | Not applicable to mobile |
| `pointer-events` | ❌  | ❌      |                          |
| `resize`         | ❌  | ❌      | Not applicable to mobile |
| `counter-*`      | ❌  | ❌      |                          |
| `list-style`     | ❌  | ❌      |                          |

---

## HTML-like Elements Feature Parity

The project provides web-like semantic elements. Below is a comprehensive comparison of HTML elements.

### Document Structure

| Element    | iOS | Android | Notes                                     |
| ---------- | --- | ------- | ----------------------------------------- |
| `<html>` | ❌  | ❌      | Not applicable - NativeScript is the root |
| `<head>` | ❌  | ❌      | Not applicable                            |
| `<body>` | ❌  | ❌      | Not applicable - use root View            |
| `<div>`  | ✅  | ✅      | Generic container (extends Scroll)        |
| `<span>` | ✅  | ✅      | Inline text container                     |

### Sectioning Elements

| Element       | iOS | Android | Notes                  |
| ------------- | --- | ------- | ---------------------- |
| `<section>` | ✅  | ✅      | Section container      |
| `<header>`  | ✅  | ✅      | Header container       |
| `<footer>`  | ✅  | ✅      | Footer container       |
| `<article>` | ✅  | ✅      | Article container      |
| `<main>`    | ✅  | ✅      | Main content container |
| `<nav>`     | ✅  | ✅      | Navigation container   |
| `<aside>`   | ✅  | ✅      | Aside container        |
| `<address>` | ❌  | ❌      | Not implemented        |
| `<hgroup>`  | ❌  | ❌      | Not implemented        |
| `<search>`  | ❌  | ❌      | Not implemented        |

### Heading Elements

| Element  | iOS | Android | Notes           |
| -------- | --- | ------- | --------------- |
| `<h1>` | ✅  | ✅      | Heading level 1 |
| `<h2>` | ✅  | ✅      | Heading level 2 |
| `<h3>` | ✅  | ✅      | Heading level 3 |
| `<h4>` | ✅  | ✅      | Heading level 4 |
| `<h5>` | ✅  | ✅      | Heading level 5 |
| `<h6>` | ✅  | ✅      | Heading level 6 |

### Text Content Elements

| Element          | iOS | Android | Notes                            |
| ---------------- | --- | ------- | -------------------------------- |
| `<p>`          | ✅  | ✅      | Paragraph                        |
| `<br>`         | ✅  | ✅      | Line break                       |
| `<blockquote>` | ✅  | ✅      | Block quotation                  |
| `<pre>`        | ❌  | ❌      | Not implemented - use `<code>` |
| `<hr>`         | ❌  | ❌      | Not implemented                  |
| `<figure>`     | ❌  | ❌      | Not implemented                  |
| `<figcaption>` | ❌  | ❌      | Not implemented                  |

### Inline Text Semantics

| Element      | iOS | Android | Notes                         |
| ------------ | --- | ------- | ----------------------------- |
| `<b>`      | ✅  | ✅      | Bold text                     |
| `<code>`   | ✅  | ✅      | Code text                     |
| `<strong>` | ❌  | ❌      | Not implemented - use `<b>` |
| `<em>`     | ❌  | ❌      | Not implemented               |
| `<i>`      | ❌  | ❌      | Not implemented               |
| `<u>`      | ❌  | ❌      | Not implemented               |
| `<s>`      | ❌  | ❌      | Not implemented               |
| `<small>`  | ❌  | ❌      | Not implemented               |
| `<sub>`    | ❌  | ❌      | Not implemented               |
| `<sup>`    | ❌  | ❌      | Not implemented               |
| `<mark>`   | ❌  | ❌      | Not implemented               |
| `<abbr>`   | ❌  | ❌      | Not implemented               |
| `<cite>`   | ❌  | ❌      | Not implemented               |
| `<q>`      | ❌  | ❌      | Not implemented               |
| `<kbd>`    | ❌  | ❌      | Not implemented               |
| `<samp>`   | ❌  | ❌      | Not implemented               |
| `<var>`    | ❌  | ❌      | Not implemented               |
| `<time>`   | ❌  | ❌      | Not implemented               |
| `<data>`   | ❌  | ❌      | Not implemented               |

### Links & Anchors

| Element | iOS | Android | Notes                              |
| ------- | --- | ------- | ---------------------------------- |
| `<a>` | ❌  | ❌      | Not implemented - use tap handlers |

### Lists

| Element    | iOS | Android | Notes                          |
| ---------- | --- | ------- | ------------------------------ |
| `<ul>`   | ✅  | ✅      | Unordered list container       |
| `<li>`   | ✅  | ✅      | List item                      |
| `<ol>`   | ❌  | ❌      | Not implemented - use `<ul>` |
| `<dl>`   | ❌  | ❌      | Not implemented                |
| `<dt>`   | ❌  | ❌      | Not implemented                |
| `<dd>`   | ❌  | ❌      | Not implemented                |
| `<menu>` | ❌  | ❌      | Not implemented                |

### Forms

| Element        | iOS | Android | Notes                                |
| -------------- | --- | ------- | ------------------------------------ |
| `<input>`    | ✅  | ✅      | Multiple types supported             |
| `<button>`   | ✅  | ✅      | Button element                       |
| `<form>`     | ❌  | ❌      | Not implemented - no form submission |
| `<label>`    | ❌  | ❌      | Not implemented                      |
| `<textarea>` | ❌  | ❌      | Not implemented - use `<input>`    |
| `<select>`   | ❌  | ❌      | Not implemented                      |
| `<option>`   | ❌  | ❌      | Not implemented                      |
| `<optgroup>` | ❌  | ❌      | Not implemented                      |
| `<fieldset>` | ❌  | ❌      | Not implemented                      |
| `<legend>`   | ❌  | ❌      | Not implemented                      |
| `<datalist>` | ❌  | ❌      | Not implemented                      |
| `<output>`   | ❌  | ❌      | Not implemented                      |
| `<progress>` | ❌  | ❌      | Not implemented                      |
| `<meter>`    | ❌  | ❌      | Not implemented                      |

### Input Types Supported

| Type               | iOS | Android | Notes               |
| ------------------ | --- | ------- | ------------------- |
| `text`           | ✅  | ✅      | Standard text input |
| `password`       | ✅  | ✅      | Password field      |
| `email`          | ✅  | ✅      | Email input         |
| `number`         | ✅  | ✅      | Numeric input       |
| `tel`            | ✅  | ✅      | Telephone input     |
| `url`            | ✅  | ✅      | URL input           |
| `search`         | ✅  | ✅      | Search input        |
| `date`           | ✅  | ✅      | Date picker         |
| `time`           | ✅  | ✅      | Time picker         |
| `datetime-local` | ✅  | ✅      | DateTime picker     |
| `month`          | ✅  | ✅      | Month picker        |
| `week`           | ✅  | ✅      | Week picker         |
| `color`          | ✅  | ✅      | Color picker        |
| `checkbox`       | ✅  | ✅      | Checkbox            |
| `radio`          | ✅  | ✅      | Radio button        |
| `button`         | ✅  | ✅      | Button type         |
| `submit`         | ✅  | ✅      | Submit button       |
| `reset`          | ✅  | ✅      | Reset button        |
| `file`           | ✅  | ✅      | File picker         |
| `range`          | ✅  | ✅      | Range slider        |
| `hidden`         | ❌  | ❌      | Not implemented     |

### Media Elements

| Element       | iOS | Android | Notes           |
| ------------- | --- | ------- | --------------- |
| `<img>`     | ✅  | ✅      | Image element   |
| `<video>`   | ❌  | ❌      | Not implemented |
| `<audio>`   | ❌  | ❌      | Not implemented |
| `<source>`  | ❌  | ❌      | Not implemented |
| `<track>`   | ❌  | ❌      | Not implemented |
| `<picture>` | ❌  | ❌      | Not implemented |
| `<canvas>`  | ❌  | ❌      | Not implemented |
| `<svg>`     | ❌  | ❌      | Not implemented |
| `<map>`     | ❌  | ❌      | Not implemented |
| `<area>`    | ❌  | ❌      | Not implemented |

### Scrolling & Interactive

| Element       | iOS | Android | Notes                                           |
| ------------- | --- | ------- | ----------------------------------------------- |
| `<scroll>`  | ✅  | ✅      | Custom scroll container (NativeScript specific) |
| `<details>` | ❌  | ❌      | Not implemented                                 |
| `<summary>` | ❌  | ❌      | Not implemented                                 |
| `<dialog>`  | ❌  | ❌      | Not implemented                                 |

### Table Elements

| Element        | iOS | Android | Notes           |
| -------------- | --- | ------- | --------------- |
| `<table>`    | ❌  | ❌      | Not implemented |
| `<thead>`    | ❌  | ❌      | Not implemented |
| `<tbody>`    | ❌  | ❌      | Not implemented |
| `<tfoot>`    | ❌  | ❌      | Not implemented |
| `<tr>`       | ❌  | ❌      | Not implemented |
| `<th>`       | ❌  | ❌      | Not implemented |
| `<td>`       | ❌  | ❌      | Not implemented |
| `<caption>`  | ❌  | ❌      | Not implemented |
| `<colgroup>` | ❌  | ❌      | Not implemented |
| `<col>`      | ❌  | ❌      | Not implemented |

### Embedded Content

| Element      | iOS | Android | Notes                         |
| ------------ | --- | ------- | ----------------------------- |
| `<iframe>` | ❌  | ❌      | Not implemented - use WebView |
| `<embed>`  | ❌  | ❌      | Not implemented               |
| `<object>` | ❌  | ❌      | Not implemented               |
| `<portal>` | ❌  | ❌      | Not implemented               |

### Scripting

| Element        | iOS | Android | Notes           |
| -------------- | --- | ------- | --------------- |
| `<script>`   | ❌  | ❌      | Not applicable  |
| `<noscript>` | ❌  | ❌      | Not applicable  |
| `<template>` | ❌  | ❌      | Not implemented |
| `<slot>`     | ❌  | ❌      | Not applicable  |

### Summary of Implemented Elements

**✅ Implemented (25 elements):**

- Layout: `div`, `section`, `header`, `footer`, `article`, `main`, `nav`, `aside`
- Text: `span`, `p`, `h1`-`h6`, `br`, `blockquote`, `code`, `b`
- Lists: `ul`, `li`
- Forms: `input` (20 types), `button`
- Media: `img`
- Custom: `scroll`

**❌ Not Implemented (Notable gaps):**

- Links: `a`
- Text formatting: `strong`, `em`, `i`, `u`, `s`, `small`, `sub`, `sup`, `mark`, `pre`
- Forms: `form`, `textarea`, `select`, `label`, `fieldset`
- Lists: `ol`, `dl`
- Tables: All table elements
- Media: `video`, `audio`, `canvas`, `svg`
- Interactive: `details`, `summary`, `dialog`

---

## Unit Support

| Unit          | iOS | Android | Web Spec                    |
| ------------- | --- | ------- | --------------------------- |
| `px`        | ✅  | ✅      | ✅                          |
| `%`         | ✅  | ✅      | ✅                          |
| `dip`       | ✅  | ✅      | N/A (NativeScript specific) |
| `auto`      | ✅  | ✅      | ✅                          |
| `fr` (grid) | ✅  | ✅      | ✅                          |
| `em`        | ❌  | ❌      | ✅                          |
| `rem`       | ❌  | ❌      | ✅                          |
| `vh`        | ❌  | ❌      | ✅                          |
| `vw`        | ❌  | ❌      | ✅                          |
| `vmin`      | ❌  | ❌      | ✅                          |
| `vmax`      | ❌  | ❌      | ✅                          |
| `ch`        | ❌  | ❌      | ✅                          |
| `ex`        | ❌  | ❌      | ✅                          |
| `calc()`    | ❌  | ❌      | ✅                          |

---

## Summary

### Strengths

- **Full Flexbox support**: All core flexbox properties are implemented
- **Comprehensive Grid support**: Grid layout with templates, areas, auto-flow, and named lines
- **Cross-platform parity**: iOS and Android have identical feature sets
- **Performance**: Rust-based layout engine (Taffy) provides efficient calculations
- **Web-like elements**: Semantic HTML elements available for familiar structure

### Key Gaps

1. **No transform/animation support** - Visual transformations must be handled at the native layer
2. **No viewport units** - `vh`, `vw` etc. not available
3. **No CSS calculations** - `calc()`, `min()`, `max()`, `clamp()` not supported
4. **Limited position values** - Only `relative` and `absolute` supported
5. **No multi-column layout** - Column-based layouts not implemented
6. **No table display** - Table CSS display modes not supported
7. **No pseudo-elements** - `::before`, `::after` etc. not available
8. **No container queries** - Modern responsive container queries not implemented

### Recommendations for Developers

1. Use `display: flex` or `display: grid` for layouts instead of floats
2. Use `%` for responsive sizing instead of viewport units
3. Handle animations through NativeScript's native animation APIs
4. Use `display: none` instead of `visibility: hidden`
5. Calculate values in JavaScript if `calc()` functionality is needed
