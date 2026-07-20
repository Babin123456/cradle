const test = require('node:test');
const assert = require('node:assert/strict');
const { COLORS, createTokens, calculateDistanceToHome, isValidMove, checkWinner } = require('../projects/games/ludo-game/ludoEngine');
const { evaluateMove, selectBestBotMove } = require('../projects/games/ludo-game/ludoBot');

test('creates 4 starting tokens per color at home position -1', () => {
    const tokens = createTokens('red', 40);
    assert.equal(tokens.length, 4);
    tokens.forEach(t => {
        assert.equal(t.position, -1);
        assert.equal(t.finished, false);
        assert.equal(t.color, 'red');
    });
});

test('token inside home requires a 6 to move out', () => {
    const tokens = createTokens('green', 40);
    const homeToken = tokens[0];

    assert.equal(isValidMove(homeToken, 'green', 5), false);
    assert.equal(isValidMove(homeToken, 'green', 6), true);
});

test('calculateDistanceToHome returns correct distance for red starting position', () => {
    const tokens = createTokens('red', 40);
    const token = tokens[0];
    token.position = 0; // START_INDEX red
    const dist = calculateDistanceToHome(token);
    assert.equal(dist, 50);
});

test('heuristic bot evaluates captures higher than basic moves', () => {
    const redTokens = createTokens('red', 40);
    const blueTokens = createTokens('blue', 40);
    redTokens[0].position = 10;
    redTokens[1].position = 20;
    blueTokens[0].position = 13; // 3 steps away from redTokens[0]

    const state = { red: redTokens, blue: blueTokens };

    const scoreCapturingMove = evaluateMove(redTokens[0], 3, state);
    const scoreNormalMove = evaluateMove(redTokens[1], 3, state); // normal step move without capture

    assert.ok(scoreCapturingMove > scoreNormalMove, `Capturing move (${scoreCapturingMove}) should score higher than normal move (${scoreNormalMove})`);
});

test('checkWinner reports true when all 4 tokens are finished', () => {
    const state = { red: createTokens('red') };
    assert.equal(checkWinner(state, 'red'), false);

    state.red.forEach(t => t.finished = true);
    assert.equal(checkWinner(state, 'red'), true);
});
