// --- LUDO HEURISTIC BOT AI ENGINE ---
const { COLORS, GLOBAL_TRACK, SAFE_ZONES, START_INDEX, calculateDistanceToHome, isValidMove } = typeof require !== 'undefined' ? require('./ludoEngine') : window;

function evaluateMove(token, diceValue, gameState) {
    let score = 10;

    let newPosition = -1;
    let newIsVictoryPath = token.isVictoryPath;

    if (token.position === -1) {
        score += 50; // High priority: spawn out of home
        newPosition = START_INDEX[token.color];
    } else if (token.isVictoryPath) {
        newPosition = token.position + diceValue;
        if (newPosition === 5) {
            score += 60; // Finish line priority
        }
    } else {
        const dist = calculateDistanceToHome(token);
        if (diceValue > dist) {
            newIsVictoryPath = true;
            newPosition = diceValue - dist - 1;
            score += 40; // Enter victory corridor
        } else {
            newPosition = (token.position + diceValue) % 52;
        }
    }

    // Check for safe zone landing or capture opportunities
    if (!newIsVictoryPath && newPosition !== -1) {
        const [r, c] = GLOBAL_TRACK[newPosition];
        const isSafe = SAFE_ZONES.some(z => z[0] === r && z[1] === c);

        if (isSafe) {
            score += 30; // Land on safe star
        } else if (gameState) {
            COLORS.forEach(otherColor => {
                if (otherColor !== token.color && gameState[otherColor]) {
                    gameState[otherColor].forEach(targetToken => {
                        if (!targetToken.isVictoryPath && targetToken.position === newPosition) {
                            score += 100; // Capture enemy token
                        }
                    });
                }
            });
        }
    }

    return score;
}

function selectBestBotMove(validMoves, diceValue, gameState) {
    if (!validMoves || validMoves.length === 0) return null;

    let bestMove = null;
    let bestScore = -1;

    validMoves.forEach(token => {
        const score = evaluateMove(token, diceValue, gameState);
        if (score > bestScore) {
            bestScore = score;
            bestMove = token;
        } else if (score === bestScore) {
            if (Math.random() > 0.5) {
                bestMove = token;
            }
        }
    });

    return bestMove;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        evaluateMove,
        selectBestBotMove
    };
}
