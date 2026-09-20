/* =========================================================================
   AUTO ROLL & SPEED CONTROLS
   ========================================================================= */

let isRolling = true;
let scrollSpeed = 1.0;
let scrollPos = 0;
let animationFrameId = null;

const viewport = document.getElementById('scrollViewport');
const rollToggleBtn = document.getElementById('roll-toggle-btn');
const chromaToggleBtn = document.getElementById('toggle-chroma-btn');

function autoRollStep() {
  if (isRolling && viewport) {
    scrollPos += 0.8 * scrollSpeed;
    viewport.scrollTop = scrollPos;

    // Loop back to top smoothly
    if (viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 5) {
      scrollPos = 0;
      viewport.scrollTop = 0;
    }
  }
  animationFrameId = requestAnimationFrame(autoRollStep);
}

// Start auto rolling
animationFrameId = requestAnimationFrame(autoRollStep);

function toggleAutoRoll() {
  isRolling = !isRolling;
  if (isRolling) {
    rollToggleBtn.innerText = '⏸ Pause Roll';
    rollToggleBtn.className = 'ctrl-btn btn-play';
    scrollPos = viewport.scrollTop;
  } else {
    rollToggleBtn.innerText = '▶ Play Roll';
    rollToggleBtn.className = 'ctrl-btn';
    rollToggleBtn.style.background = '#16a34a';
  }
}

function setScrollSpeed(speed, btnElement) {
  scrollSpeed = speed;
  document.querySelectorAll('.speed-btn').forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');
}

function resetScrollTop() {
  scrollPos = 0;
  viewport.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mouse hover တွင် အမှားမနှိပ်မိစေရန် ခေတ္တ Pause ထားခြင်း
viewport.addEventListener('mouseenter', () => {
  if (isRolling) {
    isRolling = false;
    rollToggleBtn.innerText = '▶ Auto-Paused';
  }
});

viewport.addEventListener('mouseleave', () => {
  if (!isRolling && rollToggleBtn.innerText === '▶ Auto-Paused') {
    isRolling = true;
    rollToggleBtn.innerText = '⏸ Pause Roll';
    scrollPos = viewport.scrollTop;
  }
});


/* =========================================================================
   FIGHT RESULT SYSTEM (Win = Auto Lose Opponent)
   ========================================================================= */

/**
 * Fighter A သို့မဟုတ် Fighter B ကို Win နှိပ်ပါက တစ်ဖက်လူ အလိုအလျောက် Lose ဖြစ်စေသည့် function
 * @param {string} fightId - ဥပမာ 'fight-1'
 * @param {'A' | 'B' | 'D'} outcome - 'A' = Left Win, 'B' = Right Win, 'D' = Draw
 */
function setFightResult(fightId, outcome) {
  const row = document.getElementById(fightId);
  if (!row) return;

  const sideA = row.querySelector('.fighter-a');
  const sideB = row.querySelector('.fighter-b');

  // အရင် state အားလုံးကို အရင် သန့်ရှင်းရေးလုပ်မည်
  sideA.classList.remove('is-winner', 'is-loser', 'is-draw');
  sideB.classList.remove('is-winner', 'is-loser', 'is-draw');

  if (outcome === 'A') {
    // Fighter A နိုင် -> Fighter B အလိုအလျောက် ရှုံး
    sideA.classList.add('is-winner');
    sideB.classList.add('is-loser');
  } else if (outcome === 'B') {
    // Fighter B နိုင် -> Fighter A အလိုအလျောက် ရှုံး
    sideB.classList.add('is-winner');
    sideA.classList.add('is-loser');
  } else if (outcome === 'D') {
    // သရေ (Draw)
    sideA.classList.add('is-draw');
    sideB.classList.add('is-draw');
  }
}

/**
 * ပွဲတစ်ခုချင်းစီကို Reset လုပ်ခြင်း
 */
function resetSingleFight(fightId) {
  const row = document.getElementById(fightId);
  if (!row) return;

  const sideA = row.querySelector('.fighter-a');
  const sideB = row.querySelector('.fighter-b');
  sideA.classList.remove('is-winner', 'is-loser', 'is-draw');
  sideB.classList.remove('is-winner', 'is-loser', 'is-draw');
}

/**
 * ပွဲစဉ်အားလုံးကို Reset လုပ်ခြင်း
 */
function resetAllFights() {
  document.querySelectorAll('.fighter-side').forEach(card => {
    card.classList.remove('is-winner', 'is-loser', 'is-draw');
  });
}

/**
 * Green Screen ON / Transparent OFF Toggle
 */
function toggleChroma() {
  const body = document.body;
  if (body.classList.contains('chroma-active')) {
    body.classList.remove('chroma-active');
    body.classList.add('chroma-transparent');
    chromaToggleBtn.innerText = 'BG: Transparent (OBS)';
    chromaToggleBtn.style.background = '#0284c7';
  } else {
    body.classList.remove('chroma-transparent');
    body.classList.add('chroma-active');
    chromaToggleBtn.innerText = 'BG: Green Screen (ON)';
    chromaToggleBtn.style.background = '#166534';
  }
}
