const test = require('node:test');
const assert = require('node:assert/strict');
const { degToRad, calculateBallMileage, validateDefenseHit, calculateScore } = require('../projects/games/cannon-shooting/cannonEngine');
const { getCannonStats, saveCannonHit } = require('../projects/games/cannon-shooting/cannonStorage');

global.localStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, value) { this.store[key] = String(value); },
    removeItem(key) { delete this.store[key]; },
    clear() { this.store = {}; }
};

test('degToRad converts degrees to radians accurately', () => {
    assert.equal(degToRad(0), 0);
    assert.ok(Math.abs(degToRad(180) - Math.PI) < 1e-5);
    assert.ok(Math.abs(degToRad(90) - Math.PI / 2) < 1e-5);
});

test('calculateBallMileage computes correct trajectory distance', () => {
    const mileage0 = calculateBallMileage(5, 0); // cos(0) = 1 -> 9.23
    assert.equal(mileage0, 9.23);

    const mileage45 = calculateBallMileage(5, 45); // cos(45deg) ~ 0.7071 -> 9.23 / 0.7071 ~ 13.05
    assert.ok(mileage45 > 13 && mileage45 < 13.1);
});

test('validateDefenseHit accurately tests tolerance windows', () => {
    // 5 cm enemy -> 5 * 37.79 = 188.95 px
    const enemyX_cm = 5;
    const enemyAngle = 30;

    // Direct hit
    assert.equal(validateDefenseHit(188.95, 30, enemyX_cm, enemyAngle), true);

    // Slightly off but within 25px and 4deg tolerance
    assert.equal(validateDefenseHit(200, 32, enemyX_cm, enemyAngle), true);

    // Out of angle tolerance
    assert.equal(validateDefenseHit(188.95, 40, enemyX_cm, enemyAngle), false);
});

test('saveCannonHit updates high score and max streak in storage', () => {
    localStorage.clear();
    const stats0 = getCannonStats();
    assert.equal(stats0.highScore, 0);

    saveCannonHit(250, 3);
    const stats1 = getCannonStats();
    assert.equal(stats1.highScore, 250);
    assert.equal(stats1.maxStreak, 3);
    assert.equal(stats1.totalDefenses, 1);
});
