# Cannon Shooting Game Architecture Documentation

## Overview
The Cannon Shooting Game is an interactive defense simulation where players match enemy cannon trajectory angles and position offsets to intercept incoming mortar fire before impact.

## Architecture Layout

```text
┌─────────────────────────────────────────────────────────────┐
│                       Cannon HUD & UI                       │
│      Angle Controls, Position Handles, Score Banner         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────┴──────────────────────────────┐
│             Kinematics Engine (cannonEngine.js)            │
│   • Ball Mileage Trajectory: (X + 4.23) / cos(θ)            │
│   • Tolerance Interception Window Check                     │
│   • Score & Streak Multiplier Calculation                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────┴──────────────────────────────┐
│               Score Storage (cannonStorage.js)              │
│   • Max Streak & High Score Persistence in LocalStorage     │
└─────────────────────────────────────────────────────────────┘
```

## Physics & Trigonometry Equations
- **Ball Mileage (cm)**:
  $$\text{Mileage} = \frac{X_{\text{cm}} + 4.23}{\cos(\theta)}$$
- **Hit Validation**:
  $$\text{Hit} = \left(|X_{\text{user}} - X_{\text{enemy, px}}| \le 25\text{px}\right) \land \left(|\theta_{\text{user}} - \theta_{\text{enemy}}| \le 4^\circ\right)$$

## File Structure
```text
projects/games/cannon-shooting/
├── ARCHITECTURE.md    # Architecture documentation
├── cannonEngine.js    # Trigonometric kinematics & hit detection
├── cannonStorage.js   # LocalStorage high score manager
├── index.html         # Workspace markup & canvas container
├── script.js          # Interactive user control loop
└── style.css          # HUD theme & cannon positioning CSS
```
