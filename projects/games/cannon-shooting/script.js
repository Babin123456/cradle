// --- CANNON SHOOTING INTERACTIVE CONTROLLER ---
let userCanX = 185;
let userCanY = 0;
let fireTime = 13000;
let countdown = (fireTime / 1000) - 3;
let currentScore = 0;
let currentStreak = 0;

let stats = typeof getCannonStats === 'function' ? getCannonStats() : { highScore: 0, maxStreak: 0 };

function updateHUD() {
  const scoreEl = document.getElementById('score-display');
  const streakEl = document.getElementById('streak-display');
  const bestStreakEl = document.getElementById('best-streak-display');

  if (scoreEl) scoreEl.textContent = currentScore;
  if (streakEl) streakEl.textContent = currentStreak;
  if (bestStreakEl) bestStreakEl.textContent = stats.maxStreak;
}

setInterval(() => {
  countdown = countdown > 0 ? countdown : 0;
  $('.countdown').text(countdown--);
}, 1000);

setInterval(() => {
  let cmCanPipe = $('.cm .pipe');
  let allPipe = $('.pipe');
  let cmCan = $('.cannon.cm');
  let canBall = $('.ball');
  let cmCanAngle = Math.floor(Math.random() * 45);
  let cmCanX = Math.floor(Math.random() * 8) + 2;
  
  let ballMileage = typeof calculateBallMileage === 'function' 
      ? calculateBallMileage(cmCanX, cmCanAngle) 
      : ((cmCanX + 4.23) / Math.cos(cmCanAngle * (Math.PI / 180)));
      
  countdown = (fireTime / 1000) - 3;

  cmCanPipe.css({ transform: 'rotate(' + cmCanAngle + 'deg)' });
  cmCan.css({ transform: 'translateX(' + cmCanX + 'cm)' });
  $('.cm .wheel').css({ transform: 'rotate(' + (cmCanX) + 'deg)' });

  $('.level-monitor').text(cmCanAngle);
  canBall.css('left', 0);
  allPipe.removeClass('fire');
  $('.game-container').removeClass('defended');
  $('.level').width((ballMileage) + 'cm');

  setTimeout(() => {
    let isValid = typeof validateDefenseHit === 'function' 
        ? validateDefenseHit(userCanX, userCanY, cmCanX, cmCanAngle) 
        : (Math.abs(userCanX - cmCanX * 37.79) <= 25 && Math.abs(userCanY - cmCanAngle) <= 4);

    allPipe.addClass('fire');

    if (isValid) {
      $('.game-container').addClass('defended');
      currentStreak += 1;
      const stepScore = typeof calculateScore === 'function' ? calculateScore(currentStreak, Math.abs(userCanY - cmCanAngle)) : 100;
      currentScore += stepScore;
      if (typeof saveCannonHit === 'function') {
        stats = saveCannonHit(currentScore, currentStreak);
      }
      updateHUD();

      canBall.animate({ left: (-ballMileage + 4.23) + 'cm' }, 500);
    } else {
      currentStreak = 0;
      updateHUD();
      canBall.animate({ left: '-100vw' }, 1000);
    }
  }, (fireTime - 2000));
}, fireTime);

$('.wheel-handle').mousedown(function(e) {
  const clickX = e.pageX;
  let canX = 0;
  $(window).on('mousemove.wheelHandle', (ev) => {
    let canDX = (ev.pageX - clickX) + userCanX;
    canX = canDX < 375 && canDX > 35 ? canDX : canX;

    $('.user-col .cannon').css({ transform: 'translateX(' + (canX) + 'px)' });
    $('.user-col .wheel').css({ transform: 'rotate(' + (canX) + 'deg)' });
  });

  $(window).one('mouseup', () => {
    $(window).off('mousemove.wheelHandle');
    userCanX = canX;
  });
});

$('.level-handle').mousedown(function(e) {
  const clickY = e.pageY;
  let canY = 0;
  $(window).on('mousemove.levelHandle', (ev) => {
    let canDY = (ev.pageY - clickY) + userCanY;
    canY = canDY < 65 && canDY > -5 ? canDY : canY;

    $('.level-handle').text(canY);
    $('.user-col .pipe').css({ transform: 'rotate(' + (canY) + 'deg)' });
  });

  $(window).one('mouseup', () => {
    $(window).off('mousemove.levelHandle');
    userCanY = canY;
  });
});

updateHUD();
