# AlgoScope

An interactive DSA learning playground with seven algorithms, step-by-step animation and a bubble-sort mini game.

Created with Tharish.

## Features

- Bubble, selection, insertion, merge and quick sort
- Linear and binary search
- Play/pause, single-step, reset and timeline seeking
- Custom input, random arrays, speed and size controls
- Comparison and array-write counts with complexity explanations
- Five-round Next Move game with scoring and feedback
- Midnight Indigo light/dark themes with saved preference
- Animated beginner guides and ten expandable FAQs
- Responsive layout, keyboard-accessible controls and reduced-motion support

## Run locally

Open `index.html` in a browser. No installation or build step is required. Optional web fonts load from Google Fonts, with local system-font fallbacks.

## Tests

With Node.js installed, run:

```sh
node tests/algorithms.test.cjs
node tests/game.test.cjs
node tests/experience.test.cjs
```

Algorithm tests cover 385 cases. Game and experience checks cover scoring, restart, theme fallback, guide topics and close controls using a minimal DOM stand-in; they do not replace browser layout or accessibility testing.

## How it works

`algorithms.js` produces independent snapshots at comparisons, swaps and writes. `app.js` renders the selected snapshot, and playback advances a frame cursor. `game.js` handles the independent bubble-sort decision game. `theme.js` applies the initial theme and `help.js` manages explanations and the theme toggle. CSS provides responsive layouts and the color theme.

Binary search sorts input before searching; its counters exclude that preparation. Swaps count as two array writes. Complexity labels describe the underlying algorithms, including recursion space, rather than the additional memory used to record animation snapshots.

## Publish with GitHub Pages

In repository Settings → Pages, select Deploy from a branch, `main`, and `/(root)`. Save and wait for GitHub to show the live URL. The `.nojekyll` file keeps this a plain static site.

## Possible extensions

Heap sort, recursion-tree visualization, side-by-side algorithm comparison and operation-count export.
