// --- CANNON SHOOTING SCORE & STREAK STORAGE ---
const CANNON_STORAGE_KEY = 'cradle_cannon_stats_v1';

function getCannonStats() {
    try {
        const raw = localStorage.getItem(CANNON_STORAGE_KEY);
        return raw ? JSON.parse(raw) : { highScore: 0, maxStreak: 0, totalDefenses: 0 };
    } catch (e) {
        console.error('Failed to read cannon stats from localStorage', e);
        return { highScore: 0, maxStreak: 0, totalDefenses: 0 };
    }
}

function saveCannonHit(score, currentStreak) {
    const stats = getCannonStats();
    stats.totalDefenses += 1;
    if (currentStreak > stats.maxStreak) {
        stats.maxStreak = currentStreak;
    }
    if (score > stats.highScore) {
        stats.highScore = score;
    }
    try {
        localStorage.setItem(CANNON_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
        console.error('Failed to save cannon stats', e);
    }
    return stats;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCannonStats,
        saveCannonHit
    };
}
