/* =========================================================
   PERSONAL v8.3 — script.js
   Ramon — Linha do Tempo + Treinos + Timer + Histórico
   ========================================================= */

const LS_KEYS = {
  DONE: 'personal_done_v83',
  AVATAR: 'personal_avatar_v83',
  HISTORY: 'personal_history_v83'
};

// ------------ UTIL ------------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const fmt2 = n => String(n).padStart(2, '0');

function todayISO(d = new Date()) {
  const y = d.getFullYear();
  const m = fmt2(d.getMonth() + 1);
  const day = fmt2(d.getDate());
  return `${y}-${m}-${day}`;
}
function getWeekStartMonday(d = new Date()) {
  const dt = new Date(d);
  const day = dt.getDay(); // 0=Dom..6=Sab
  const diff = (day === 0 ? -6 : 1) - day; // segunda
  dt.setDate(dt.getDate() + diff);
  dt.setHours(0,0,0,0);
  return dt;
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function dayNamePT(iMonday0) {
  const names = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
  return names[iMonday0] || '';
}
function dayLetterPT(iMonday0) {
  const letters = ['S','T','Q','Q','S','S','D'];
  return letters[iMonday0] || '';
}
function vibrate(msOrPattern) {
  if (navigator.vibrate) navigator.vibrate(msOrPattern);
}
function beep(duration = 180, freq = 880, type = 'sine', volume = 0.06) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => { osc.stop(); ctx.close(); }, duration);
  } catch (e) {}
}
function toast(msg, t = 1800) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), t);
}
function tip(msg, t = 2600) {
  const el = $('#assistantTip');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), t);
}

// ------------ STORAGE ------------
function loadJSON(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function saveJSON(key, v) {
  localStorage.setItem(key, JSON.stringify(v));
}

// ------------ DADOS DOS TREINOS ------------
/* Ordem e textos conforme enviado, com vídeos vinculados na MESMA ordem */
const TREINOS = [
  {
    id: 'posterior_gluteo',
    nome: 'Posterior e Glúteo',
    itens: [
      {
        nome: 'Agachamento Sumô com Halteres',
        serie: '3x10/10/10 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 60,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-sumo-squat-front.mp4'
      },
      {
        nome: 'Leg Press 45',
        serie: '4x15 pés colados + 15 afastados',
        carga: '12kg',
        intervalo: 40,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Machine-leg-press-front.mp4'
      },
      {
        nome: 'Adução de Quadril Máquina',
        serie: '3x10/10/10 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 60,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Machine-machine-hip-adduction-front.mp4'
      },
      {
        nome: 'Cadeira Flexora',
        serie: '3x10/10/10 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 60,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Machine-seated-leg-curl-side.mp4'
      },
      {
        nome: 'Cadeira Flexora Unilateral',
        serie: '3x10/10/10/10 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 60,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/machines/_1080/Seated_Leg_Curl_FR_1080.mp4'
      },
      {
        nome: 'Panturrilha no Step',
        serie: '4x15',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-calves-stretch-variation-3-side.mp4'
      },
      {
        nome: 'Abdominal Canivete',
        serie: '4x15',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-suitcase-crunch-side.mp4'
      },
      {
        nome: 'Esteira Caminhada',
        serie: '30 reps',
        carga: '—',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Cardio-treadmill-walk-side.mp4'
      }
    ]
  },
  {
    id: 'quadriceps',
    nome: 'Quadríceps',
    itens: [
      {
        nome: 'Agachamento com Halteres',
        serie: '3x10+10+10 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 60,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-front-rack-squat-side.mp4'
      },
      {
        nome: 'Abdução de Quadril Máquina',
        serie: '3x10+10+10 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 60,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Machine-machine-hip-abduction-front.mp4'
      },
      {
        nome: 'Elíptico',
        serie: '25 reps',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Cardio-elliptical-side.mp4'
      },
      {
        nome: 'Afundo com Barra Livre',
        serie: '3x12, 3x10, 2x8',
        carga: '0kg',
        intervalo: 60,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-reverse-lunge-side.mp4'
      },
      {
        nome: 'Agachamento Sumô no Step com Halteres',
        serie: '3x10+10+10 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 60,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/dumbbells/_1080/DB_Sumo_Squat_FR_1080.mp4'
      },
      {
        nome: 'Abdução de Quadril Máquina (variação)',
        serie: '3x10+10+10 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 60,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/machines/_1080/Hip_Abduction_FR_1080.mp4'
      },
      {
        nome: 'Cadeira Extensora',
        serie: '3x10+10+10 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 60,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-machine-leg-extension-side.mp4'
      },
      {
        nome: 'Cadeira Extensora Unilateral',
        serie: '3x10+10+10 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 60,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/machines/_1080/Single_Leg_Extension_FR_1080.mp4'
      },
      {
        nome: 'Leg Press 45 Unilateral',
        serie: '3x12, 3x10, 2x8',
        carga: '0kg',
        intervalo: 60,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/machines/_1080/Leg_Press_FR_1080.mp4'
      }
    ]
  },
  {
    id: 'peito_triceps_biceps',
    nome: 'Peito, Tríceps e Bíceps',
    itens: [
      {
        nome: 'Alongamento de Ombros e Tríceps II',
        serie: '3x20',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-shoulders-stretch-variation-1-front.mp4'
      },
      {
        nome: 'Bike Spinning Sentada',
        serie: '40 reps',
        carga: '—',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Cardio-stationary-bike-side.mp4'
      },
      {
        nome: 'Abdominal Supra Solo',
        serie: '5x15',
        carga: '0kg',
        intervalo: 40,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/bodyweight/_1080/Crunch_FR_1080.mp4'
      },
      {
        nome: 'Tríceps Unilateral na Polia Alta (Pegada Neutra)',
        serie: '3x15',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Cables-cable-single-arm-rope-pushdown-side.mp4'
      },
      {
        nome: 'Alongamento de Peitoral (Espaldar)',
        serie: '3x15',
        carga: '0kg',
        intervalo: 40,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-chest-stretch-variation-1-side.mp4'
      },
      {
        nome: 'Mobilidade de Ombro III',
        serie: '3x20',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Recovery-thoracic-extensions-via-shoulder-flexion-foam-roller-front.mp4'
      },
      {
        nome: 'Rosca Alternada com Halteres',
        serie: '3x15',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-curl-side.mp4'
      },
      {
        nome: 'Tríceps na Polia com Corda',
        serie: '3x15 lento + 15 curto',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Cables-cable-push-down-side.mp4'
      },
      {
        nome: 'Tríceps Unilateral na Polia Alta (Pegada Neutra) (variação)',
        serie: '3x15',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Cables-cable-single-arm-rope-pushdown-side.mp4'
      },
      {
        nome: 'Crucifixo com Halteres',
        serie: '4x12',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-incline-chest-fly-front.mp4'
      },
      {
        nome: 'Crucifixo Inclinado com Halteres',
        serie: '4x12',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-incline-chest-flys-side.mp4'
      },
      {
        nome: 'Rosca Martelo com Halteres',
        serie: '4x12',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-hammer-curl-side.mp4'
      }
    ]
  },
  {
    id: 'ombro_costas',
    nome: 'Ombro e Costas',
    itens: [
      {
        nome: 'Puxada Alta (pegada neutra)',
        serie: '3x10/8/6 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-machine-pulldown-side.mp4'
      },
      {
        nome: 'Abdominal Canivete',
        serie: '3x12',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/bodyweight/_1080/V-Up_FR_1080.mp4'
      },
      {
        nome: 'Esteira Caminhada',
        serie: '40 reps',
        carga: '—',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Cardio-treadmill-walk-side.mp4'
      },
      {
        nome: 'Elevação Lateral Unilateral Sentado com Halteres',
        serie: '3x10/8/6 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-neutral-overhead-press-side.mp4'
      },
      {
        nome: 'Elevação Frontal Alternada',
        serie: '3x12',
        carga: '4 a 6kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-front-raise-side.mp4'
      },
      {
        nome: 'Desenvolvimento com Halteres (pegada neutra)',
        serie: '3x10/8/6 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/dumbbells/_1080/Neutral_Grip_DB_Press_FR_1080.mp4'
      },
      {
        nome: 'Puxada Neutra (triângulo)',
        serie: '3x10/8/6 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/cables/_1080/Seated_Row_V_Grip_FR_1080.mp4'
      },
      {
        nome: 'Remada Baixa (triângulo)',
        serie: '3x10/8/6 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-machine-seated-cable-row-front.mp4'
      },
      {
        nome: 'Puxada Aberta Barra Reta',
        serie: '3x10/8/6 (Drop: tudo conta como 1 série)',
        carga: '0kg',
        intervalo: 30,
        video: 'https://media.musclewiki.com/media/uploads/videos/branded/female-machine-pulldown-side.mp4'
      }
    ]
  }
];

// ------------ ESTADO DE CONCLUSÃO ------------
let done = loadJSON(LS_KEYS.DONE, {}); // { [exerciseId]: true }
function exerciseId(sectionId, idx) {
  return `${sectionId}__${idx}`;
}

// ------------ RENDER UI ------------
function renderSections() {
  const container = $('#sectionsContainer');
  container.innerHTML = '';
  TREINOS.forEach(sec => {
    const secEl = document.createElement('section');
    secEl.className = 'section';
    secEl.dataset.section = sec.id;

    // header (fechada por padrão)
    const headerBtn = document.createElement('button');
    headerBtn.className = 'section-header';
    headerBtn.setAttribute('aria-expanded', 'false');

    const title = document.createElement('div');
    title.className = 'section-title';
    title.innerHTML = `
      <span>${sec.nome}</span>
      <span class="badge">${sec.itens.length} exercícios</span>
    `;

    const toggle = document.createElement('div');
    toggle.className = 'toggle';
    toggle.textContent = '+';

    headerBtn.appendChild(title);
    headerBtn.appendChild(toggle);

    // body
    const body = document.createElement('div');
    body.className = 'section-body';
    const grid = document.createElement('div');
    grid.className = 'grid';

    sec.itens.forEach((it, i) => {
      const id = exerciseId(sec.id, i);
      const card = document.createElement('div');
      card.className = 'card';
      if (done[id]) card.classList.add('done');

      const check = document.createElement('button');
      check.className = 'check';
      check.setAttribute('aria-label', 'Marcar como concluído');
      check.innerHTML = card.classList.contains('done') ? okIcon() : circleIcon();
      check.addEventListener('click', e => {
        e.stopPropagation();
        toggleDone(id, card, it.nome);
      });

      const title = document.createElement('h5');
      title.textContent = it.nome;

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.innerHTML = `<strong>Série:</strong> ${it.serie} · <strong>Carga:</strong> ${it.carga}`;

      const video = document.createElement('video');
      video.src = it.video;
      video.controls = true;
      video.preload = 'none';
      video.playsInline = true;

      const row = document.createElement('div');
      row.className = 'row';

      const btnInterval = document.createElement('button');
      btnInterval.className = 'btn ghost';
      btnInterval.textContent = `Intervalo ${it.intervalo || 30}s`;
      btnInterval.addEventListener('click', e => {
        e.stopPropagation();
        openTimer(it.intervalo || 30, () => {
          // ao concluir o timer, marcar concluído (opcional)
        });
      });

      const btnConcluir = document.createElement('button');
      btnConcluir.className = 'btn';
      btnConcluir.textContent = 'Concluir';
      btnConcluir.addEventListener('click', e => {
        e.stopPropagation();
        toggleDone(id, card, it.nome, true);
      });

      row.appendChild(btnInterval);
      row.appendChild(btnConcluir);

      card.appendChild(check);
      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(video);
      card.appendChild(row);
      grid.appendChild(card);
    });

    body.appendChild(grid);
    secEl.appendChild(headerBtn);
    secEl.appendChild(body);

    // toggle abrir/fechar
    headerBtn.addEventListener('click', () => {
      const open = secEl.classList.toggle('open');
      headerBtn.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '−' : '+';
      if (open) tip('Lembrete: 3–5 min de aquecimento antes de iniciar 🔥');
    });

    container.appendChild(secEl);
  });
}

// ------------ ÍCONES ------------
function circleIcon() {
  return `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" opacity=".6"/>
  </svg>`;
}
function okIcon() {
  return `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="url(#g1)"/>
    <path d="M7 12.5l3.1 3.1L17 9.6" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <defs>
      <linearGradient id="g1" x1="4" y1="4" x2="20" y2="20">
        <stop stop-color="#30d7a9"/>
        <stop offset="1" stop-color="#2f80ed"/>
      </linearGradient>
    </defs>
  </svg>`;
}

// ------------ MARCAR CONCLUÍDO + HISTÓRICO ------------
function toggleDone(id, card, nome, forceTrue = false) {
  const nowIso = todayISO();
  const history = loadJSON(LS_KEYS.HISTORY, {}); // { 'YYYY-MM-DD': count }
  const isDone = !!done[id];

  if (isDone && !forceTrue) {
    delete done[id];
    card.classList.remove('done');
    card.querySelector('.check').innerHTML = circleIcon();
    saveJSON(LS_KEYS.DONE, done);
    toast(`"${nome}" desmarcado.`);
    // opcional: não reduz histórico (histórico guarda o que foi concluído naquele dia)
  } else {
    done[id] = true;
    card.classList.add('done');
    card.querySelector('.check').innerHTML = okIcon();
    saveJSON(LS_KEYS.DONE, done);

    history[nowIso] = (history[nowIso] || 0) + 1;
    saveJSON(LS_KEYS.HISTORY, history);
    toast(`Boa! "${nome}" concluído 💪`);
    updateTimeline();
  }
  updateMiniStats();
}

// ------------ LINHA DO TEMPO ------------
function buildTimelineSkeleton() {
  const wrap = $('#timeline');
  wrap.innerHTML = '';
  const weekStart = getWeekStartMonday();
  for (let i = 0; i < 7; i++) {
    const d = addDays(weekStart, i);
    const el = document.createElement('div');
    el.className = 'day';
    el.dataset.date = todayISO(d);
    el.dataset.level = '0';
    el.setAttribute('title', todayISO(d));
    el.innerHTML = `<span>${dayLetterPT(i)}</span><div class="tooltip">${dayNamePT(i)}: 0 concluídos</div>`;
    wrap.appendChild(el);
  }
}
function updateTimeline() {
  const history = loadJSON(LS_KEYS.HISTORY, {});
  const weekStart = getWeekStartMonday();
  let totalWeek = 0;
  let best = { count: -1, idx: -1 };

  $$('.timeline .day').forEach((el, i) => {
    const date = todayISO(addDays(weekStart, i));
    const count = history[date] || 0;
    totalWeek += count;

    let level = 0;
    if (count >= 1 && count <= 2) level = 1;       // leve
    else if (count >= 3 && count <= 5) level = 2;  // médio
    else if (count >= 6) level = 3;                // meta batida

    el.dataset.level = String(level);
    el.dataset.meta = level === 3 ? 'true' : 'false';
    const tt = $('.tooltip', el);
    if (tt) tt.textContent = `${dayNamePT(i)}: ${count} concluído${count!==1?'s':''}`;

    if (count > best.count) best = { count, idx: i };
  });

  $('#totalDone').textContent = String(totalWeek);
  $('#daysActive').textContent = String(
    $$('.timeline .day').filter(d => (d.dataset.level|0) > 0).length
  );
  $('#bestDay').textContent = best.count > 0 ? dayNamePT(best.idx) : '—';

  // Histórico modal lista
  const list = $('#historyList');
  list.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const date = todayISO(addDays(weekStart, i));
    const count = history[date] || 0;
    const li = document.createElement('li');
    li.textContent = `${dayNamePT(i)} (${date}): ${count} concluído${count!==1?'s':''}`;
    list.appendChild(li);
  }
}

// ------------ TIMER (Intervalo) ------------
let timer = {
  total: 0,
  left: 0,
  tick: null,
  running: false
};
function openTimer(seconds = 30, onConclude) {
  timer.total = seconds;
  timer.left = seconds;
  timer.running = false;
  $('#timerDisplay').textContent = `00:${fmt2(seconds)}`;
  $('#timerStartPause').textContent = 'Iniciar';
  $('#timerModal').classList.add('show');

  const startPause = $('#timerStartPause');
  const cancel = $('#timerCancel');
  const conclude = $('#timerConclude');

  const start = () => {
    if (timer.running) return;
    timer.running = true;
    $('#timerStartPause').textContent = 'Pausar';
    // Beep + vibra no início
    beep(150, 920, 'sine', 0.07);
    vibrate([60,40,60]);

    timer.tick = setInterval(() => {
      timer.left--;
      if (timer.left <= 0) {
        $('#timerDisplay').textContent = `00:00`;
        clearInterval(timer.tick);
        timer.running = false;
        beep(300, 1000, 'square', 0.09);
        vibrate([120,60,120,60,180]);
        tip('Intervalo finalizado! Vamos voltar 👊', 2200);
        if (typeof onConclude === 'function') onConclude();
      } else {
        // Últimos 5s: alerta progressivo
        if (timer.left <= 5) {
          beep(120, 980 + (5 - timer.left)*40, 'triangle', 0.08);
          vibrate([50,50,80]);
        }
        const m = Math.floor(timer.left / 60);
        const s = timer.left % 60;
        $('#timerDisplay').textContent = `${fmt2(m)}:${fmt2(s)}`;
      }
    }, 1000);
  };

  const pause = () => {
    if (!timer.running) return;
    timer.running = false;
    clearInterval(timer.tick);
    $('#timerStartPause').textContent = 'Retomar';
    toast('Pausado');
  };

  startPause.onclick = () => {
    if (!timer.running) start(); else pause();
  };
  cancel.onclick = () => {
    clearInterval(timer.tick);
    timer.running = false;
    $('#timerModal').classList.remove('show');
  };
  conclude.onclick = () => {
    clearInterval(timer.tick);
    timer.running = false;
    $('#timerModal').classList.remove('show');
    toast('Intervalo concluído ✔');
  };
}

// ------------ HISTÓRICO MODAL ------------
$('#historyBtn')?.addEventListener('click', () => {
  $('#historyModal').classList.add('show');
});
function closeHistory() {
  $('#historyModal').classList.remove('show');
}
window.closeHistory = closeHistory;

// ------------ RESET ------------
$('#resetBtn')?.addEventListener('click', () => {
  if (confirm('Zerar progresso e histórico da semana?')) {
    localStorage.removeItem(LS_KEYS.DONE);
    localStorage.removeItem(LS_KEYS.HISTORY);
    done = {};
    renderSections();
    buildTimelineSkeleton();
    updateTimeline();
    updateMiniStats();
    toast('Tudo zerado.');
  }
});

// ------------ AVATAR ------------
(function initAvatar() {
  const img = $('#avatarImg');
  const inp = $('#avatarInput');
  const btn = $('#avatarBtn');
  const stored = localStorage.getItem(LS_KEYS.AVATAR);
  if (stored) img.src = stored;

  btn.addEventListener('click', () => inp.click());
  inp.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result;
      localStorage.setItem(LS_KEYS.AVATAR, reader.result);
    };
    reader.readAsDataURL(file);
  });
})();

// ------------ MINI STATS ------------
function updateMiniStats() {
  const total = Object.keys(done).length;
  $('#totalDone').textContent = String(total);

  // dias ativos já calculado em updateTimeline()
}

// ------------ INIT ------------
function initAssistant() {
  setTimeout(() => tip('Hidrate-se entre as séries 💧'), 1500);
  setTimeout(() => tip('Dica: mantenha a postura e controle o movimento.'), 4600);
}
function init() {
  renderSections();           // monta seções fechadas por padrão
  buildTimelineSkeleton();    // monta a linha do tempo
  updateTimeline();           // pinta níveis conforme histórico
  updateMiniStats();
  initAssistant();
}
document.addEventListener('DOMContentLoaded', init);
