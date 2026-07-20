# Ludo Game Architecture Documentation

## Overview
The Ludo Game is a browser-based 4-player classic board game supporting human vs. human, human vs. bot, or fully automated bot simulations. It features HTML5 canvas board rendering, 3D CSS dice rolling animations, state persistence in LocalStorage, and heuristic AI decision making.

## Architecture Layout

```text
┌─────────────────────────────────────────────────────────────┐
│                       HTML5 Workspace                       │
│    Canvas, Player Indicators, 3D Rolling Dice, Control Modal│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────┴──────────────────────────────┐
│                  Ludo Core Engine (ludoEngine.js)            │
│   • Global Track (52 tiles) & Safe Zone Mapping             │
│   • Token Position Interpolation & Victory Paths            │
│   • Move Validation & Capture Detection                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────┴──────────────────────────────┐
│                    Heuristic AI Bot (ludoBot.js)            │
│   • Move Priority Evaluator (Captures, Safe Stars, Home)    │
│   • Automated Turn Execution                                │
└─────────────────────────────────────────────────────────────┘
```

## Board & Coordinate Mapping
- **Global Track**: 52 coordinates forming the outer loop $[0, \dots, 51]$.
- **Safe Zones**: 8 designated safe tiles (including starting stars) where tokens cannot be captured.
- **Victory Paths**: 5 color-coded inner tiles leading directly to the center triangle.

## File Hierarchy
```text
projects/games/ludo-game/
├── ARCHITECTURE.md    # Architecture documentation
├── index.html         # HTML template & modals
├── ludoBot.js         # Heuristic bot decision engine
├── ludoEngine.js      # Board tracks, tokens & move validation
├── script.js          # Canvas renderer & event wiring
└── style.css          # Styling & 3D dice CSS rules
```
