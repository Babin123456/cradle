// --- LUDO GAME CORE ENGINE & TRACK GEOMETRY ---
const COLORS = ["red", "green", "blue", "yellow"];

const GLOBAL_TRACK = [
    [6,1],[6,2],[6,3],[6,4],[6,5],
    [5,6],[4,6],[3,6],[2,6],[1,6],[0,6],
    [0,7],
    [0,8],[1,8],[2,8],[3,8],[4,8],[5,8],
    [6,9],[6,10],[6,11],[6,12],[6,13],[6,14],
    [7,14],
    [8,14],[8,13],[8,12],[8,11],[8,10],[8,9],
    [9,8],[10,8],[11,8],[12,8],[13,8],[14,8],
    [14,7],
    [14,6],[13,6],[12,6],[11,6],[10,6],[9,6],
    [8,5],[8,4],[8,3],[8,2],[8,1],[8,0],
    [7,0]
];

const SAFE_ZONES = [
    [6,1], [2,6], [1,8], [6,13],
    [8,13], [12,8], [13,6], [8,1]
];

const VICTORY_PATHS = {
    red:    [[7,1], [7,2], [7,3], [7,4], [7,5]],
    green:  [[1,7], [2,7], [3,7], [4,7], [5,7]],
    blue:   [[7,13], [7,12], [7,11], [7,10], [7,9]],
    yellow: [[13,7], [12,7], [11,7], [10,7], [9,7]]
};

const HOME_CENTERS = {
    red: [[2,2], [2,3], [3,2], [3,3]],
    green: [[2,11], [2,12], [3,11], [3,12]],
    blue: [[11,11], [11,12], [12,11], [12,12]],
    yellow: [[11,2], [11,3], [12,2], [12,3]]
};

const START_INDEX = { red: 0, green: 13, blue: 26, yellow: 39 };

function createTokens(color, cellSize = 40) {
    return Array.from({ length: 4 }, (_, id) => ({
        id,
        color,
        position: -1,
        isVictoryPath: false,
        finished: false,
        currentX: HOME_CENTERS[color][id][1] * cellSize + cellSize / 2,
        currentY: HOME_CENTERS[color][id][0] * cellSize + cellSize / 2,
        targetX: null,
        targetY: null,
        animProgress: 1,
        zOffset: 0
    }));
}

function calculateDistanceToHome(token) {
    let homeEntryIndex;
    if (token.color === 'red') homeEntryIndex = 50;
    if (token.color === 'green') homeEntryIndex = 11;
    if (token.color === 'blue') homeEntryIndex = 24;
    if (token.color === 'yellow') homeEntryIndex = 37;

    if (token.position <= homeEntryIndex) return homeEntryIndex - token.position;
    return (52 - token.position) + homeEntryIndex;
}

function isValidMove(token, currentColor, diceValue) {
    if (!token || currentColor !== token.color || diceValue === null) return false;
    if (token.finished) return false;

    if (token.position === -1) {
        return diceValue === 6;
    }

    if (token.isVictoryPath) {
        return token.position + diceValue <= 5;
    }

    const distToHome = calculateDistanceToHome(token);
    if (diceValue > distToHome + 5) {
        return false;
    }

    return true;
}

function checkWinner(state, color) {
    return state[color] && state[color].every(t => t.finished);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        COLORS,
        GLOBAL_TRACK,
        SAFE_ZONES,
        VICTORY_PATHS,
        HOME_CENTERS,
        START_INDEX,
        createTokens,
        calculateDistanceToHome,
        isValidMove,
        checkWinner
    };
}
