'use strict';

const room = document.querySelector('#room');
const character = document.querySelector('#character');
const viewport = document.querySelector('#viewport');
const backdrop = document.querySelector('#backdrop');
const dialog = document.querySelector('#dialog');
const dialogBody = document.querySelector('#dialog-body');
const welcome = document.querySelector('#welcome');
const close = document.querySelector('#close');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Four interactive objects. The bed, smokes and matcha are only decorative.
const destinations = {
  photo:  { x: 63, y: 65 },
  laptop: { x: 65, y: 67 },
  letter: { x: 67, y: 69 },
  record: { x: 80, y: 65 }
};

// Audio file supplied for this project. Playing starts on the record-player tap.
const LOCAL_AUDIO_FILE = 'assets/everlong.mp3';
const laptopMessages = ['research nanaman?!', 'luh, may pubmat ulit?!'];
let laptopIndex = -1;
let movingTimer = null;
let previousFocus = null;
let currentX = 72;
let currentY = 66;
let pendingInteraction = 0;

const birthdayLetter = `Hi Juliana,

Happy Birthday!

I made this simple website as a gift for you, dahil din pasiklab ako :p. You can explore and interact with what I mostly remember about you.

I hope you’ll have a fun birthday today! Ik you have an event pa sa org mo and sana di ikaw mastress. Just do the thing you enjoy the most today and wag mo muna isipin mga gawain mo, may bukas pa naman yan haha. If ever you feel nothing to do today you know who to call (mr one move it away) to help you spend your day. Sagot ko na matcha mo :pp.

Sana magustuhan mo tong website kahit kinda rushed syaa. I hope this made your day happy  birthday ulit nigga faggot.

Mailiw nak kenkan`;

const screens = {
  photo: () => `
    <img class="photo-large" src="assets/hangout-photo.png" alt="A photograph from our last hangout" loading="eager">
    <p class="photo-caption">tara yb na ulit :p</p>`,
  laptop: () => `
    <p class="tiny-label">something on the laptop</p><h2 id="dialog-title">the laptop 💻</h2>
    <div class="laptop" role="status" aria-live="polite">${laptopMessages[laptopIndex]}</div>`,
  letter: () => `
    <h2 id="dialog-title">a letter for Juliana 💌</h2>
    <div class="paper" id="birthday-letter"></div>`,
  record: () => `
    <h2 id="dialog-title">the record player ♫</h2>
    <div class="record" id="vinyl" aria-hidden="true"></div>
    <p class="song-meta">Everlong · Foo Fighters</p>
    <p class="muted record-message">hmmmmm</p>
    <button class="dialog-button" id="music-toggle" type="button" aria-label="Pause or play the record">⏸ pause</button>
    <p class="muted music-status" id="music-status" role="status" aria-live="polite">starting audio…</p>
    <audio id="room-audio" preload="auto"></audio>`
};

function setupRecordPlayer() {
  const audio = dialogBody.querySelector('#room-audio');
  const status = dialogBody.querySelector('#music-status');
  const vinyl = dialogBody.querySelector('#vinyl');
  const toggle = dialogBody.querySelector('#music-toggle');
  if (!audio) return;
  audio.src = LOCAL_AUDIO_FILE;
  const setPlaying = playing => {
    vinyl.classList.toggle('spin', playing);
    toggle.textContent = playing ? '⏸ pause' : '▶ play';
    toggle.setAttribute('aria-label', playing ? 'Pause audio' : 'Play audio');
  };
  audio.addEventListener('playing', () => {
    setPlaying(true);
    status.textContent = 'now playing ♫';
  });
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('ended', () => { setPlaying(false); status.textContent = 'finished ♫'; });
  audio.addEventListener('error', () => { setPlaying(false); status.textContent = 'audio unavailable, tap play to retry'; });
  toggle.addEventListener('click', () => {
    if (audio.paused) audio.play().catch(() => { status.textContent = 'tap play again to enable sound'; });
    else audio.pause();
  });
  // Called directly from the record-player click, which allows audio on mobile.
  audio.play().catch(() => {
    setPlaying(false);
    status.textContent = 'tap play to start the audio';
  });
}

function openDialog(item) {
  if (!screens[item]) return;
  previousFocus = document.activeElement;
  // Each separate tap on the laptop opens the next message. No next button.
  if (item === 'laptop') laptopIndex = (laptopIndex + 1) % laptopMessages.length;
  dialogBody.innerHTML = screens[item]();
  if (item === 'letter') dialogBody.querySelector('#birthday-letter').textContent = birthdayLetter;
  if (item === 'photo') {
    dialog.removeAttribute('aria-labelledby');
    dialog.setAttribute('aria-label', 'Photo from our hangout');
  } else {
    dialog.setAttribute('aria-labelledby', 'dialog-title');
    dialog.removeAttribute('aria-label');
  }
  backdrop.hidden = false;
  document.body.classList.add('modal-open');
  if (item === 'record') setupRecordPlayer();
  close.focus({preventScroll:true});
}
function closeDialog() {
  if (backdrop.hidden) return;
  const playingAudio = dialogBody.querySelector('#room-audio');
  if (playingAudio) { playingAudio.pause(); playingAudio.removeAttribute('src'); playingAudio.load(); }
  backdrop.hidden = true;
  dialogBody.replaceChildren();
  document.body.classList.remove('modal-open');
  previousFocus?.focus?.({preventScroll:true});
}
function moveAvatar(target) {
  clearTimeout(movingTimer);
  const dx = target.x-currentX;
  const dy = target.y-currentY;
  const distance = Math.hypot(dx,dy);
  character.classList.toggle('facing-left',dx<0);
  const duration = reducedMotion.matches ? 0 : Math.min(1300,Math.max(350,distance*47));
  // A stable foot-level anchor keeps the taller character grounded while walking.
  currentX = target.x;
  currentY = target.y;
  character.style.transitionDuration = `${duration}ms`;
  character.classList.toggle('walking', duration>0);
  character.style.left = `${target.x}%`;
  character.style.top = `${target.y}%`;

  if (viewport.scrollWidth>viewport.clientWidth) {
    const position=(target.x/100)*room.getBoundingClientRect().width-viewport.clientWidth*0.52;
    viewport.scrollTo({left: Math.max(0, position),behavior:reducedMotion.matches?'instant':'smooth'});
  }
  return duration;
}
function goTo(item) {
  if (!welcome.hidden || !destinations[item]) return;
  if (!backdrop.hidden) closeDialog();
  const requestId = ++pendingInteraction;
  const duration = moveAvatar(destinations[item]);
  // Record audio must begin in this click handler, not after the walk or a phone may block it.
  if (item === 'record') {
    openDialog(item);
    movingTimer = setTimeout(() => { if(requestId===pendingInteraction) character.classList.remove('walking'); },duration+45);
  } else {
    movingTimer=setTimeout(() => {
      if (requestId !== pendingInteraction) return;
      character.classList.remove('walking');
      openDialog(item);
    },duration+45);
  }
}
room.querySelectorAll('[data-item]').forEach(button => {
  button.addEventListener('click',() => goTo(button.dataset.item));
});
document.querySelectorAll('[data-go]').forEach(button => {
  button.addEventListener('click',() => goTo(button.dataset.go));
});

document.querySelector('#enter').addEventListener('click',() => {
  welcome.hidden = true;
  if (viewport.scrollWidth > viewport.clientWidth) {
    const center = (room.getBoundingClientRect().width - viewport.clientWidth) / 2;
    viewport.scrollLeft = Math.max(0, center);
  }
  document.querySelector('[data-item="laptop"]').focus({preventScroll:true});
});
document.querySelector('#help').addEventListener('click',() => {
  previousFocus=document.activeElement;
  dialog.setAttribute('aria-labelledby','dialog-title'); dialog.removeAttribute('aria-label');
  dialogBody.innerHTML=`<h2 id="dialog-title">how to explore ♡</h2><p>happy birthday, Juliana! tap a glowing icon to explore the laptop, photo, letter or record player.</p><p>on your phone, swipe across the room or use the shortcuts below.</p><p class="muted">the bed, matcha and smokes are just room decorations.</p>`;
  backdrop.hidden=false;
  document.body.classList.add('modal-open');
  close.focus({preventScroll:true});
});
close.addEventListener('click',closeDialog);
backdrop.addEventListener('click',event=>{if(event.target===backdrop)closeDialog();});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape' && !backdrop.hidden)closeDialog();
  if(event.key==='Tab' && !backdrop.hidden){
    const focusable=[...dialog.querySelectorAll('button:not([disabled]),a[href],iframe')];
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  }
});
