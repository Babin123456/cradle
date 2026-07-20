// --- CANNON SHOOTING KINEMATICS & PHYSICS ENGINE ---
function degToRad(deg) {
    return deg * (Math.PI / 180);
}

function calculateBallMileage(posX, angleDeg) {
    const angleRad = degToRad(angleDeg);
    const cosVal = Math.cos(angleRad);
    if (cosVal === 0) return posX + 4.23;
    return (posX + 4.23) / cosVal;
}

function validateDefenseHit(userX, userAngle, enemyX_cm, enemyAngle) {
    const comCanX_px = enemyX_cm * 37.79; // convert cm to px
    const isXValid = Math.abs(userX - comCanX_px) <= 25; // 25px tolerance window
    const isAngleValid = Math.abs(userAngle - enemyAngle) <= 4; // 4 deg angle tolerance

    return isXValid && isAngleValid;
}

function calculateScore(streak, angleAccuracy) {
    const baseScore = 100;
    const streakBonus = streak * 25;
    const accuracyBonus = Math.max(0, 50 - angleAccuracy * 10);
    return Math.floor(baseScore + streakBonus + accuracyBonus);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        degToRad,
        calculateBallMileage,
        validateDefenseHit,
        calculateScore
    };
}
